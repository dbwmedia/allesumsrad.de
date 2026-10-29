<?php
/**
 * Front-end loading tweaks.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Header logo: GeneratePress prints the full 2560px PNG (47 KB) for a ~160px
// logo. Serve a 520px WebP (2x for retina) from the theme instead.
add_filter('generate_logo', function () {
    return get_stylesheet_directory_uri() . '/assets/img/Reifenservice-Schedler-Logo.webp';
});

// jQuery is only needed by plugin scripts in the footer (counter block).
// Loaded in the head it blocks the first render, so move it to the footer.
add_action('wp_enqueue_scripts', function () {
    if (is_admin()) {
        return;
    }
    foreach (array('jquery', 'jquery-core', 'jquery-migrate') as $handle) {
        wp_script_add_data($handle, 'group', 1);
    }
}, 1);
