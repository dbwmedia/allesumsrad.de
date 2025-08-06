<?php
/**
 * KFZ Angebote System
 * 
 * Eigenständiges System für die Verwaltung von Angeboten
 * Funktioniert ohne ACF - verwendet native WordPress Meta Boxes
 * 
 * Usage in functions.php:
 * require_once get_stylesheet_directory() . '/kfz-angebote-system.php';
 */

// Verhindere direkten Zugriff
if (!defined('ABSPATH')) {
    exit;
}

class KFZ_Angebote_System {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_data'));
        add_action('manage_angebot_posts_columns', array($this, 'admin_columns'));
        add_action('manage_angebot_posts_custom_column', array($this, 'admin_column_content'), 10, 2);
        add_action('wp_dashboard_setup', array($this, 'add_dashboard_widget'));
        add_shortcode('angebote_sektion', array($this, 'shortcode'));
        
        // Admin Styles
        add_action('admin_head', array($this, 'admin_styles'));
        
        // Einstellungen für Sektion aktivieren/deaktivieren
        add_action('admin_menu', array($this, 'add_settings_page'));
        add_action('admin_init', array($this, 'register_settings'));
        
        // Body Class für Button-Ausblendung
        add_filter('body_class', array($this, 'add_angebote_body_class'));
        
        // CSS für Button-Ausblendung in Head
        add_action('wp_head', array($this, 'angebote_button_styles'));
    }
    
    /**
     * Custom Post Type registrieren
     */
    public function register_post_type() {
        $labels = array(
            'name'               => 'Angebote',
            'singular_name'      => 'Angebot',
            'menu_name'          => 'Angebote',
            'add_new'            => 'Neues Angebot',
            'add_new_item'       => 'Neues Angebot hinzufügen',
            'edit_item'          => 'Angebot bearbeiten',
            'new_item'           => 'Neues Angebot',
            'view_item'          => 'Angebot anzeigen',
            'search_items'       => 'Angebote suchen',
            'not_found'          => 'Keine Angebote gefunden',
            'not_found_in_trash' => 'Keine Angebote im Papierkorb'
        );

        $args = array(
            'labels'              => $labels,
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => true,
            'menu_position'       => 20,
            'menu_icon'           => 'dashicons-tag',
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'supports'            => array('title', 'editor', 'thumbnail'),
            'has_archive'         => false,
            'rewrite'             => false,
            'show_in_rest'        => false
        );

        register_post_type('angebot', $args);
    }
    
    /**
     * Meta Boxes hinzufügen
     */
    public function add_meta_boxes() {
        add_meta_box(
            'angebot_details',
            'Angebot Details',
            array($this, 'meta_box_callback'),
            'angebot',
            'normal',
            'high'
        );
    }
    
    /**
     * Meta Box HTML
     */
    public function meta_box_callback($post) {
        wp_nonce_field('angebot_save_meta', 'angebot_meta_nonce');
        
        $preis = get_post_meta($post->ID, '_angebot_preis', true);
        $gueltig_bis = get_post_meta($post->ID, '_angebot_gueltig_bis', true);
        $aktiv = get_post_meta($post->ID, '_angebot_aktiv', true);
        $button_text = get_post_meta($post->ID, '_angebot_button_text', true) ?: 'Jetzt Termin vereinbaren';
        $button_url = get_post_meta($post->ID, '_angebot_button_url', true);
        ?>
        
        <table class="form-table">
            <tr>
                <th><label for="angebot_preis">Preis *</label></th>
                <td>
                    <input type="text" id="angebot_preis" name="angebot_preis" 
                           value="<?php echo esc_attr($preis); ?>" 
                           placeholder="z.B. 349 €" required style="width: 100%;" />
                    <p class="description">Der Preis für das Angebot (z.B. "nur 349 €")</p>
                </td>
            </tr>
            <tr>
                <th><label for="angebot_gueltig_bis">Gültig bis *</label></th>
                <td>
                    <input type="date" id="angebot_gueltig_bis" name="angebot_gueltig_bis" 
                           value="<?php echo esc_attr($gueltig_bis); ?>" required style="width: 100%;" />
                    <p class="description">Bis wann ist das Angebot gültig?</p>
                </td>
            </tr>
            <tr>
                <th><label for="angebot_aktiv">Angebot aktiv</label></th>
                <td>
                    <label>
                        <input type="checkbox" id="angebot_aktiv" name="angebot_aktiv" value="1" 
                               <?php checked($aktiv, 1); ?> />
                        Angebot ist aktiv und wird angezeigt
                    </label>
                </td>
            </tr>
            <tr>
                <th><label for="angebot_button_text">Button Text</label></th>
                <td>
                    <input type="text" id="angebot_button_text" name="angebot_button_text" 
                           value="<?php echo esc_attr($button_text); ?>" style="width: 100%;" />
                    <p class="description">Text für den Button (Standard: "Jetzt Termin vereinbaren")</p>
                </td>
            </tr>
            <tr>
                <th><label for="angebot_button_url">Button URL</label></th>
                <td>
                    <input type="url" id="angebot_button_url" name="angebot_button_url" 
                           value="<?php echo esc_attr($button_url); ?>" 
                           placeholder="https://..." style="width: 100%;" />
                    <p class="description">Wohin soll der Button führen? (z.B. /#kontakt)</p>
                </td>
            </tr>
        </table>
        
        <p><strong>Tipp:</strong> Verwenden Sie das "Beitragsbild" für das Angebot-Foto.</p>
        
        <?php
    }
    
    /**
     * Meta Daten speichern
     */
    public function save_meta_data($post_id) {
        if (!isset($_POST['angebot_meta_nonce']) || !wp_verify_nonce($_POST['angebot_meta_nonce'], 'angebot_save_meta')) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        $fields = array('preis', 'gueltig_bis', 'aktiv', 'button_text', 'button_url');
        
        foreach ($fields as $field) {
            $value = isset($_POST['angebot_' . $field]) ? sanitize_text_field($_POST['angebot_' . $field]) : '';
            update_post_meta($post_id, '_angebot_' . $field, $value);
        }
    }
    
    /**
     * Admin Spalten
     */
    public function admin_columns($columns) {
        $new_columns = array();
        $new_columns['cb'] = $columns['cb'];
        $new_columns['title'] = $columns['title'];
        $new_columns['preis'] = 'Preis';
        $new_columns['gueltig_bis'] = 'Gültig bis';
        $new_columns['aktiv'] = 'Status';
        $new_columns['date'] = $columns['date'];
        
        return $new_columns;
    }
    
    /**
     * Admin Spalten Inhalt
     */
    public function admin_column_content($column, $post_id) {
        switch ($column) {
            case 'preis':
                echo esc_html(get_post_meta($post_id, '_angebot_preis', true));
                break;
            case 'gueltig_bis':
                $date = get_post_meta($post_id, '_angebot_gueltig_bis', true);
                if ($date) {
                    $formatted = date('d.m.Y', strtotime($date));
                    echo $formatted;
                    
                    // Warnung bei abgelaufenen Angeboten
                    if (strtotime($date) < time()) {
                        echo ' <span style="color: red; font-weight: bold;">(ABGELAUFEN)</span>';
                    }
                }
                break;
            case 'aktiv':
                $aktiv = get_post_meta($post_id, '_angebot_aktiv', true);
                $gueltig_bis = get_post_meta($post_id, '_angebot_gueltig_bis', true);
                $ist_abgelaufen = $gueltig_bis && strtotime($gueltig_bis) < time();
                
                if ($aktiv && !$ist_abgelaufen) {
                    echo '<span style="color: green; font-weight: bold;">✓ AKTIV</span>';
                } elseif ($aktiv && $ist_abgelaufen) {
                    echo '<span style="color: orange; font-weight: bold;">⚠ ABGELAUFEN</span>';
                } else {
                    echo '<span style="color: red;">✗ Inaktiv</span>';
                }
                break;
        }
    }
    
    /**
     * Aktive Angebote abrufen
     */
    public function get_aktive_angebote($limit = null) {
        $heute = date('Y-m-d');
        
        // Standard-Limit aus Einstellungen verwenden wenn nicht spezifiziert
        if ($limit === null) {
            $limit = get_option('kfz_angebote_max_anzeige', 1);
        }
        
        // Sortierung aus Einstellungen
        $sortierung = get_option('kfz_angebote_sortierung', 'date_desc');
        
        $orderby = 'date';
        $order = 'DESC';
        
        switch ($sortierung) {
            case 'date_asc':
                $orderby = 'date';
                $order = 'ASC';
                break;
            case 'title_asc':
                $orderby = 'title';
                $order = 'ASC';
                break;
            case 'title_desc':
                $orderby = 'title';
                $order = 'DESC';
                break;
            case 'gueltig_bis_asc':
                $orderby = 'meta_value';
                $order = 'ASC';
                break;
            case 'gueltig_bis_desc':
                $orderby = 'meta_value';
                $order = 'DESC';
                break;
            default: // date_desc
                $orderby = 'date';
                $order = 'DESC';
        }
        
        $args = array(
            'post_type'      => 'angebot',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
            'meta_query'     => array(
                'relation' => 'AND',
                array(
                    'key'     => '_angebot_aktiv',
                    'value'   => '1',
                    'compare' => '='
                ),
                array(
                    'key'     => '_angebot_gueltig_bis',
                    'value'   => $heute,
                    'compare' => '>='
                )
            ),
            'orderby' => $orderby,
            'order'   => $order
        );
        
        // Für Sortierung nach Gültigkeitsdatum
        if (strpos($sortierung, 'gueltig_bis') !== false) {
            $args['meta_key'] = '_angebot_gueltig_bis';
        }

        return get_posts($args);
    }
    
    /**
     * Shortcode für Angebote-Sektion
     */
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'limit' => null, // null = Standardwert aus Einstellungen verwenden
            'show_placeholder' => 'true'
        ), $atts);

        // Prüfen ob Sektion global deaktiviert ist
        if (!get_option('kfz_angebote_sektion_aktiv', true)) {
            return '';
        }

        // Limit aus Einstellungen wenn nicht im Shortcode gesetzt
        $limit = $atts['limit'] !== null ? intval($atts['limit']) : null;
        $angebote = $this->get_aktive_angebote($limit);
        
        if (empty($angebote)) {
            if ($atts['show_placeholder'] === 'true') {
                return $this->render_placeholder();
            }
            return '';
        }

        return $this->render_angebote_sektion($angebote);
    }
    
    /**
     * Angebote-Sektion rendern (passend zu Ihrem aktuellen Design)
     */
    private function render_angebote_sektion($angebote) {
        $hintergrundbild = get_option('kfz_angebote_hintergrundbild', '');
        $bg_style = '';
        
        if ($hintergrundbild) {
            $bg_style = 'style="--inline-bg-image: url(' . esc_url($hintergrundbild) . ')"';
        }
        
        ob_start();
        ?>
        
        <section class="section--fullwidth gb-element-angebote dbw-parallax" <?php echo $bg_style; ?> id="angebote">
            <div class="aktion"></div>
            <section class="dbw-text-medien dbw-text-medien--boxed-glass-dark">
                <div class="dbw-text-medien-inner aos-fade-up" data-aos="fade-up">
                    
                    <?php if (count($angebote) === 1): ?>
                        <!-- Single Angebot Layout (wie bisher) -->
                        <?php 
                        $angebot = $angebote[0];
                        $this->render_single_angebot($angebot);
                        ?>
                    <?php else: ?>
                        <!-- Multiple Angebote Layout mit Theme Card System -->
                        <div class="angebote-multiple-wrapper">
                            <div class="angebote-header">
                                <p class="gb-text highlight-label"><strong>Jetzt sparen</strong></p>
                                <h3 class="gb-text">Unsere aktuellen Angebote</h3>
                            </div>
                            
                            <?php 
                            $angebote_count = count($angebote);
                            $grid_class = 'grid-auto-' . $angebote_count;
                            ?>
                            <div class="gb-element-angebote-cards grid auto <?php echo esc_attr($grid_class); ?>" 
                                 data-smart-grid-children="<?php echo $angebote_count; ?>" 
                                 data-smart-grid-class="<?php echo esc_attr($grid_class); ?>">
                                
                                <?php foreach ($angebote as $angebot): ?>
                                    <?php $this->render_angebot_theme_card($angebot); ?>
                                <?php endforeach; ?>
                                
                            </div>
                        </div>
                    <?php endif; ?>
                    
                </div>
            </section>
        </section>
        
        <?php
        return ob_get_clean();
    }
    
    /**
     * Einzelnes Angebot rendern (Original Layout)
     */
    private function render_single_angebot($angebot) {
        $preis = get_post_meta($angebot->ID, '_angebot_preis', true);
        $gueltig_bis = get_post_meta($angebot->ID, '_angebot_gueltig_bis', true);
        $button_text = get_post_meta($angebot->ID, '_angebot_button_text', true) ?: 'Jetzt Termin vereinbaren';
        $button_url = get_post_meta($angebot->ID, '_angebot_button_url', true);
        $thumbnail = get_the_post_thumbnail($angebot->ID, 'large', array('loading' => 'lazy', 'decoding' => 'async'));
        
        $gueltig_bis_formatted = '';
        if ($gueltig_bis) {
            $gueltig_bis_formatted = date('d.m.Y', strtotime($gueltig_bis));
        }
        ?>
        
        <div class="gb-element-angebote-grid grid">
            <div class="text">
                <p class="gb-text highlight-label"><strong>Jetzt sparen</strong></p>
                <h3 class="gb-text">Unsere aktuellen Angebote</h3>
                <p class="gb-text text-large">
                    <?php echo esc_html($angebot->post_title); ?><br>
                    <?php if ($angebot->post_content): ?>
                        <?php echo wp_strip_all_tags($angebot->post_content); ?><br>
                    <?php endif; ?>
                    <?php if ($preis): ?>
                        <?php echo esc_html($preis); ?><br>
                    <?php endif; ?>
                    <?php if ($gueltig_bis_formatted): ?>
                        Jetzt Termin sichern. Gültig bis <?php echo esc_html($gueltig_bis_formatted); ?>
                    <?php endif; ?>
                </p>
                <?php if ($button_url): ?>
                <div>
                    <a class="gb-text button--primary smooth-scroll" href="<?php echo esc_url($button_url); ?>">
                        <?php echo esc_html($button_text); ?>
                    </a>
                </div>
                <?php endif; ?>
            </div>
            <div class="medien">
                <?php if ($thumbnail): ?>
                    <?php echo $thumbnail; ?>
                <?php endif; ?>
            </div>
        </div>
        
        <?php
    }
    
    /**
     * Theme-konsistente Angebot-Karte für Multiple Layout
     */
    private function render_angebot_theme_card($angebot) {
        $preis = get_post_meta($angebot->ID, '_angebot_preis', true);
        $gueltig_bis = get_post_meta($angebot->ID, '_angebot_gueltig_bis', true);
        $button_text = get_post_meta($angebot->ID, '_angebot_button_text', true) ?: 'Jetzt Termin vereinbaren';
        $button_url = get_post_meta($angebot->ID, '_angebot_button_url', true);
        $thumbnail = get_the_post_thumbnail($angebot->ID, 'large', array('loading' => 'lazy', 'decoding' => 'async'));
        
        $gueltig_bis_formatted = '';
        if ($gueltig_bis) {
            $gueltig_bis_formatted = date('d.m.Y', strtotime($gueltig_bis));
        }
        ?>
        
        <div class="card card--hero card--compact angebot aos-fade-up" data-aos="fade-up">
            <?php if ($thumbnail): ?>
                <?php echo $thumbnail; ?>
            <?php endif; ?>
            
            <div class="card__content">
                <div class="card__header">
                    <h3 class="gb-text card__title"><?php echo esc_html($angebot->post_title); ?></h3>
                    
                    <?php if ($preis): ?>
                        <p class="gb-text card__subtitle angebot-preis"><?php echo esc_html($preis); ?></p>
                    <?php endif; ?>
                </div>
                
                <div class="card__body">
                    <?php if ($angebot->post_content): ?>
                        <p><?php echo wp_strip_all_tags($angebot->post_content); ?></p>
                    <?php endif; ?>
                    
                    <?php if ($gueltig_bis_formatted): ?>
                        <p class="angebot-gueltig"><small>Gültig bis <?php echo esc_html($gueltig_bis_formatted); ?></small></p>
                    <?php endif; ?>
                </div>
                
                <?php if ($button_url): ?>
                    <div class="card__footer btn-container">
                        <a class="gb-text button--primary" href="<?php echo esc_url($button_url); ?>">
                            <?php echo esc_html($button_text); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        
        <?php
    }
    
    /**
     * Platzhalter rendern
     */
    private function render_placeholder() {
        $placeholder_text = get_option('kfz_angebote_placeholder_text', 'Aktuell keine besonderen Angebote verfügbar. Kontaktieren Sie uns für aktuelle Preise!');
        
        ob_start();
        ?>
        <section class="section--fullwidth gb-element-angebote-placeholder" id="angebote-placeholder">
            <div class="angebote-placeholder-content">
                <p><?php echo esc_html($placeholder_text); ?></p>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
    
    /**
     * Dashboard Widget
     */
    public function add_dashboard_widget() {
        wp_add_dashboard_widget(
            'kfz_angebote_dashboard',
            'KFZ Angebote Übersicht',
            array($this, 'dashboard_widget_content')
        );
    }
    
    /**
     * Dashboard Widget Inhalt
     */
    public function dashboard_widget_content() {
        $max_anzeige = get_option('kfz_angebote_max_anzeige', 1);
        $angebote = $this->get_aktive_angebote(5); // Mehr für Übersicht
        $total = wp_count_posts('angebot');
        $sektion_aktiv = get_option('kfz_angebote_sektion_aktiv', true);
        $hintergrundbild = get_option('kfz_angebote_hintergrundbild', '');
        
        echo '<div class="angebote-dashboard">';
        echo '<h4>Status: ' . ($sektion_aktiv ? '<span style="color: green;">Sektion AKTIV</span>' : '<span style="color: red;">Sektion DEAKTIVIERT</span>') . '</h4>';
        echo '<p><strong>Anzeige:</strong> Maximal ' . $max_anzeige . ' Angebot(e) werden angezeigt</p>';
        echo '<p><strong>Aktive Angebote:</strong> ' . count($angebote) . ' | <strong>Gesamt:</strong> ' . $total->publish . '</p>';
        
        if ($hintergrundbild) {
            echo '<p><strong>Hintergrundbild:</strong> ✓ Gesetzt</p>';
        } else {
            echo '<p><strong>Hintergrundbild:</strong> ⚠ Nicht gesetzt</p>';
        }
        
        echo '<p><a href="' . admin_url('edit.php?post_type=angebot') . '" class="button">Alle verwalten</a> ';
        echo '<a href="' . admin_url('edit.php?post_type=angebot&page=angebote-einstellungen') . '" class="button">Einstellungen</a></p>';
        
        if (!empty($angebote)) {
            echo '<ul>';
            foreach ($angebote as $angebot) {
                $gueltig_bis = get_post_meta($angebot->ID, '_angebot_gueltig_bis', true);
                echo '<li><strong>' . esc_html($angebot->post_title) . '</strong>';
                if ($gueltig_bis) {
                    echo '<br>bis ' . date('d.m.Y', strtotime($gueltig_bis));
                }
                echo '</li>';
            }
            echo '</ul>';
        } else {
            echo '<p><em>Keine aktiven Angebote vorhanden.</em></p>';
        }
        echo '</div>';
    }
    
    /**
     * Einstellungsseite hinzufügen
     */
    public function add_settings_page() {
        add_submenu_page(
            'edit.php?post_type=angebot',  // Parent: Angebote Menü
            'Angebote Einstellungen',      // Page title
            'Einstellungen',               // Menu title  
            'manage_options',              // Capability
            'angebote-einstellungen',      // Menu slug
            array($this, 'settings_page_content') // Callback
        );
    }
    
    /**
     * Einstellungen registrieren
     */
    public function register_settings() {
        register_setting('kfz_angebote_settings', 'kfz_angebote_sektion_aktiv');
        register_setting('kfz_angebote_settings', 'kfz_angebote_placeholder_text');
        register_setting('kfz_angebote_settings', 'kfz_angebote_hintergrundbild');
        register_setting('kfz_angebote_settings', 'kfz_angebote_max_anzeige');
        register_setting('kfz_angebote_settings', 'kfz_angebote_sortierung');
        
        add_settings_section(
            'kfz_angebote_main_settings',
            'Angebote Sektion Einstellungen',
            array($this, 'settings_section_callback'),
            'kfz-angebote-einstellungen'
        );
        
        add_settings_field(
            'kfz_angebote_sektion_aktiv',
            'Sektion aktiviert',
            array($this, 'sektion_aktiv_callback'),
            'kfz-angebote-einstellungen',
            'kfz_angebote_main_settings'
        );
        
        add_settings_field(
            'kfz_angebote_hintergrundbild',
            'Hintergrundbild',
            array($this, 'hintergrundbild_callback'),
            'kfz-angebote-einstellungen',
            'kfz_angebote_main_settings'
        );
        
        add_settings_field(
            'kfz_angebote_max_anzeige',
            'Maximale Anzahl Angebote',
            array($this, 'max_anzeige_callback'),
            'kfz-angebote-einstellungen',
            'kfz_angebote_main_settings'
        );
        
        add_settings_field(
            'kfz_angebote_sortierung',
            'Sortierung der Angebote',
            array($this, 'sortierung_callback'),
            'kfz-angebote-einstellungen',
            'kfz_angebote_main_settings'
        );
        
        add_settings_field(
            'kfz_angebote_placeholder_text',
            'Platzhalter-Text',
            array($this, 'placeholder_text_callback'),
            'kfz-angebote-einstellungen',
            'kfz_angebote_main_settings'
        );
    }
    
    /**
     * Einstellungsseite Inhalt
     */
    public function settings_page_content() {
        ?>
        <div class="wrap">
            <h1>Angebote Sektion Einstellungen</h1>
            
            <?php if (isset($_GET['settings-updated'])): ?>
                <div class="notice notice-success is-dismissible">
                    <p><strong>Einstellungen gespeichert!</strong></p>
                </div>
            <?php endif; ?>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('kfz_angebote_settings');
                do_settings_sections('kfz-angebote-einstellungen');
                submit_button();
                ?>
            </form>
            
            <div class="card" style="margin-top: 20px;">
                <h2>Verwendung & Dokumentation</h2>
                <p><strong>Shortcode:</strong> <code>[angebote_sektion]</code></p>
                <p><strong>Shortcode-Parameter:</strong></p>
                <ul>
                    <li><code>[angebote_sektion limit="2"]</code> - Überschreibt die Standard-Anzahl</li>
                    <li><code>[angebote_sektion show_placeholder="false"]</code> - Platzhalter ausblenden</li>
                </ul>
                
                <h3>Template-Integration</h3>
                <p>Für Entwickler:</p>
                <code>if (class_exists('KFZ_Angebote_System')) {<br>
                &nbsp;&nbsp;&nbsp;&nbsp;echo do_shortcode('[angebote_sektion]');<br>
                }</code>
                
                <h3>Aktueller Status</h3>
                <?php 
                $aktive_angebote = $this->get_aktive_angebote(10);
                $sektion_aktiv = get_option('kfz_angebote_sektion_aktiv', true);
                ?>
                <p><strong>Sektion:</strong> <?php echo $sektion_aktiv ? '<span style="color: green;">✓ Aktiv</span>' : '<span style="color: red;">✗ Deaktiviert</span>'; ?></p>
                <p><strong>Aktive Angebote:</strong> <?php echo count($aktive_angebote); ?></p>
                <p><strong>Werden angezeigt:</strong> <?php echo min(count($aktive_angebote), get_option('kfz_angebote_max_anzeige', 1)); ?></p>
            </div>
        </div>
        <?php
    }
    
    public function settings_section_callback() {
        echo '<p>Hier können Sie die globalen Einstellungen für die Angebote-Sektion verwalten.</p>';
    }
    
    public function sektion_aktiv_callback() {
        $value = get_option('kfz_angebote_sektion_aktiv', true);
        echo '<label><input type="checkbox" name="kfz_angebote_sektion_aktiv" value="1" ' . checked(1, $value, false) . ' /> Angebote-Sektion auf der Website anzeigen</label>';
        echo '<p class="description">Wenn deaktiviert, wird die gesamte Sektion ausgeblendet (auch bei aktiven Angeboten).</p>';
    }
    
    public function hintergrundbild_callback() {
        $value = get_option('kfz_angebote_hintergrundbild', '');
        ?>
        <div class="hintergrundbild-wrapper">
            <input type="url" name="kfz_angebote_hintergrundbild" id="kfz_angebote_hintergrundbild" 
                   value="<?php echo esc_attr($value); ?>" class="regular-text" 
                   placeholder="https://beispiel.de/bild.jpg" />
            <button type="button" class="button" id="upload_hintergrundbild">Bild auswählen</button>
            <?php if ($value): ?>
                <button type="button" class="button" id="remove_hintergrundbild">Entfernen</button>
            <?php endif; ?>
        </div>
        
        <?php if ($value): ?>
            <div class="hintergrundbild-preview" style="margin-top: 10px;">
                <img src="<?php echo esc_url($value); ?>" style="max-width: 300px; height: auto; border: 1px solid #ddd;" />
            </div>
        <?php endif; ?>
        
        <p class="description">
            Hintergrundbild für die Angebote-Sektion. Empfohlene Größe: 1920x1080px oder größer.
            <br>Aktuell verwendet: <code>https://allesumsrad.dbw-development.de/wp-content/uploads/2025/07/reifenlager-1.jpg</code>
        </p>
        
        <script>
        jQuery(document).ready(function($) {
            var frame;
            
            $('#upload_hintergrundbild').on('click', function(e) {
                e.preventDefault();
                
                if (frame) {
                    frame.open();
                    return;
                }
                
                frame = wp.media({
                    title: 'Hintergrundbild auswählen',
                    button: { text: 'Bild verwenden' },
                    multiple: false
                });
                
                frame.on('select', function() {
                    var attachment = frame.state().get('selection').first().toJSON();
                    $('#kfz_angebote_hintergrundbild').val(attachment.url);
                    
                    // Preview aktualisieren
                    var preview = $('.hintergrundbild-preview');
                    if (preview.length) {
                        preview.find('img').attr('src', attachment.url);
                    } else {
                        $('.hintergrundbild-wrapper').after(
                            '<div class="hintergrundbild-preview" style="margin-top: 10px;">' +
                            '<img src="' + attachment.url + '" style="max-width: 300px; height: auto; border: 1px solid #ddd;" />' +
                            '</div>'
                        );
                    }
                    
                    // Remove Button anzeigen
                    if (!$('#remove_hintergrundbild').length) {
                        $('#upload_hintergrundbild').after('<button type="button" class="button" id="remove_hintergrundbild">Entfernen</button>');
                    }
                });
                
                frame.open();
            });
            
            $(document).on('click', '#remove_hintergrundbild', function(e) {
                e.preventDefault();
                $('#kfz_angebote_hintergrundbild').val('');
                $('.hintergrundbild-preview').remove();
                $(this).remove();
            });
        });
        </script>
        <?php
    }
    
    public function max_anzeige_callback() {
        $value = get_option('kfz_angebote_max_anzeige', 1);
        ?>
        <select name="kfz_angebote_max_anzeige">
            <option value="1" <?php selected($value, 1); ?>>1 Angebot</option>
            <option value="2" <?php selected($value, 2); ?>>2 Angebote</option>
            <option value="3" <?php selected($value, 3); ?>>3 Angebote</option>
        </select>
        <p class="description">
            Wie viele Angebote sollen maximal auf der Startseite angezeigt werden?<br>
            <strong>Hinweis:</strong> Bei mehr als 1 Angebot ändert sich das Layout automatisch zu einer Karten-Ansicht.
        </p>
        <?php
    }
    
    public function sortierung_callback() {
        $value = get_option('kfz_angebote_sortierung', 'date_desc');
        ?>
        <select name="kfz_angebote_sortierung">
            <option value="date_desc" <?php selected($value, 'date_desc'); ?>>Neueste zuerst (Standard)</option>
            <option value="date_asc" <?php selected($value, 'date_asc'); ?>>Älteste zuerst</option>
            <option value="gueltig_bis_asc" <?php selected($value, 'gueltig_bis_asc'); ?>>Läuft zuerst ab</option>
            <option value="gueltig_bis_desc" <?php selected($value, 'gueltig_bis_desc'); ?>>Läuft zuletzt ab</option>
            <option value="title_asc" <?php selected($value, 'title_asc'); ?>>Titel A-Z</option>
            <option value="title_desc" <?php selected($value, 'title_desc'); ?>>Titel Z-A</option>
        </select>
        <p class="description">In welcher Reihenfolge sollen die Angebote angezeigt werden?</p>
        <?php
    }
    
    public function placeholder_text_callback() {
        $value = get_option('kfz_angebote_placeholder_text', 'Aktuell keine besonderen Angebote verfügbar. Kontaktieren Sie uns für aktuelle Preise!');
        echo '<textarea name="kfz_angebote_placeholder_text" rows="3" cols="50" class="large-text">' . esc_textarea($value) . '</textarea>';
        echo '<p class="description">Dieser Text wird angezeigt, wenn keine aktiven Angebote vorhanden sind.</p>';
    }
    
    /**
     * Body Class für Angebote-Status hinzufügen
     */
    public function add_angebote_body_class($classes) {
        // Prüfen ob Sektion global deaktiviert ist
        if (!get_option('kfz_angebote_sektion_aktiv', true)) {
            $classes[] = 'angebote-deaktiviert';
            return $classes;
        }
        
        // Prüfen ob aktive Angebote vorhanden sind
        $angebote = $this->get_aktive_angebote(1);
        
        if (empty($angebote)) {
            $classes[] = 'keine-angebote-aktiv';
        } else {
            $classes[] = 'angebote-verfügbar';
        }
        
        return $classes;
    }
    
    /**
     * CSS für Button-Ausblendung
     */
    public function angebote_button_styles() {
        ?>
        <style>
        /* Angebot-Buttons ausblenden wenn keine Angebote aktiv oder Sektion deaktiviert */
        body.keine-angebote-aktiv .angebot-button,
        body.angebote-deaktiviert .angebot-button {
            display: none !important;
        }
        
        /* Optional: Sanfter Übergang */
        .angebot-button {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        body.angebote-verfügbar .angebot-button {
            opacity: 1;
            transform: scale(1);
        }
        </style>
        <?php
    }
    public function admin_styles() {
        ?>
        <style>
        /* Admin Dashboard Widget */
        .angebote-dashboard ul {
            margin: 10px 0;
            list-style: none;
            padding: 0;
        }
        .angebote-dashboard li {
            margin: 8px 0;
            padding: 8px;
            background: #f9f9f9;
            border-left: 3px solid #0073aa;
            border-radius: 3px;
        }
        
        /* Einstellungsseite */
        .hintergrundbild-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .hintergrundbild-preview {
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .hintergrundbild-preview img {
            display: block;
            max-width: 300px;
            height: auto;
            border-radius: 4px;
        }
        
        .form-table th {
            width: 180px;
            padding: 15px 10px 15px 0;
        }
        
        .form-table td {
            padding: 15px 10px;
        }
        </style>
        <?php
        
        // Media Uploader für Hintergrundbild laden
        $screen = get_current_screen();
        if ($screen && $screen->id === 'angebot_page_angebote-einstellungen') {
            wp_enqueue_media();
        }
    }
}

// System initialisieren
new KFZ_Angebote_System();