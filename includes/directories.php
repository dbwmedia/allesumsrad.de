<?php
// Pfaddefinitionen
define('SEARCHANDFILTER_DIR', get_stylesheet_directory() . '/includes/search-filter');
define('GENESIS-BLOCKS_DIR', get_stylesheet_directory() . '/includes/genesis-custom-blocks/');

/**
 * Robuste Einbindung von Webpack-kompilierten Scripts
 * mit Optimierungen für Safari und Instagram Browser
 */
function enqueue_webpack_scripts(): void {
    $build_uri = get_stylesheet_directory_uri() . '/build/';
    $asset     = include get_stylesheet_directory() . '/build/index.asset.php';

    // Build hash as version: every build busts browser and CDN caches.
    $version = $asset['version'] ?? '1.0.1';

    // Theme styles directly (previously an @import inside style.css, which
    // chained a second render-blocking request behind the first).
    wp_enqueue_style('dbw-theme', $build_uri . 'index.css', array('generate-child'), $version);

    // Main bundle is vanilla JS, no jQuery needed.
    wp_enqueue_script(
        'child-theme-scripts',
        $build_uri . 'index.js',
        $asset['dependencies'] ?? array(),
        $version,
        true // Im Footer laden für bessere Performance
    );
    
    // Script-Tag modifizieren - defer statt async verwenden für bessere Kompatibilität
    add_filter('script_loader_tag', function($tag, $handle, $src) {
        if ('child-theme-scripts' === $handle) {
            // Entferne async falls vorhanden und füge defer hinzu
            $tag = str_replace(' async', '', $tag);
            return str_replace(' src', ' defer src', $tag);
        }
        return $tag;
    }, 10, 3);
}
add_action('wp_enqueue_scripts', 'enqueue_webpack_scripts');

/**
 * Zusätzliche Header für bessere Browser-Kompatibilität
 */
function add_compatibility_headers() {
    // Content-Security-Policy anpassen
    header("Content-Security-Policy: upgrade-insecure-requests;");
}
add_action('send_headers', 'add_compatibility_headers');