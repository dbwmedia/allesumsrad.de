<?php
/**
 * Consent fixes on top of Borlabs Cookie.
 */

if (!defined('ABSPATH')) {
    exit;
}

// The Trustindex plugin enqueues cdn.trustindex.io/loader.js on every page and
// marks it with data-borlabs-cookie-script-blocker-ignore, so it loads before
// any consent and sends the visitor's IP to Trustindex. The widget markup sits
// inside the Borlabs "trust-index" content blocker, which carries its own
// loader fallback and injects the script once the visitor has consented.
$dbw_drop_trustindex_loader = function () {
    if (is_admin()) {
        return;
    }
    wp_dequeue_script('trustindex-loader-js');
};
add_action('wp_enqueue_scripts', $dbw_drop_trustindex_loader, PHP_INT_MAX);
add_action('wp_print_scripts', $dbw_drop_trustindex_loader, 0);
add_action('wp_print_footer_scripts', $dbw_drop_trustindex_loader, 0);
