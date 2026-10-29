<?php
/**
 * Self-hosted web fonts.
 *
 * The GeneratePress font library serves the full variable TTF files
 * (Inter ~850 KB, Teko ~270 KB). We ship latin subsets as WOFF2 instead
 * (Inter wght 400-800 ~30 KB, Teko wght 300-700 ~15 KB) and keep the
 * family names and --gp-font--* variables, so all existing styles work.
 */

if (!defined('ABSPATH')) {
    exit;
}

function dbw_font_url($file) {
    return get_stylesheet_directory_uri() . '/assets/fonts/' . $file;
}

// Replace the GeneratePress font stylesheet with our own @font-face rules.
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_style('generatepress-fonts');

    $css = sprintf(
        ':root{--gp-font--teko:"Teko";--gp-font--inter:"Inter"}'
        . '@font-face{font-family:"Teko";font-style:normal;font-weight:300 700;font-display:swap;src:url(%s) format("woff2")}'
        . '@font-face{font-family:"Inter";font-style:normal;font-weight:400 800;font-display:swap;src:url(%s) format("woff2")}',
        esc_url(dbw_font_url('teko-latin-var.woff2')),
        esc_url(dbw_font_url('inter-latin-var.woff2'))
    );

    wp_register_style('dbw-fonts', false, array(), null);
    wp_enqueue_style('dbw-fonts');
    wp_add_inline_style('dbw-fonts', $css);
}, 100);

// Both faces are used above the fold (hero headline + navigation).
add_action('wp_head', function () {
    foreach (array('teko-latin-var.woff2', 'inter-latin-var.woff2') as $file) {
        printf(
            '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
            esc_url(dbw_font_url($file))
        );
    }
}, 1);
