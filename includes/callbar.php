<?php
/**
 * Mobile call bar: phone + contact form, fixed at the bottom on small screens.
 * Visibility is handled in src/sass/components/_callbar.scss.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_footer', function () {
    if (is_admin()) {
        return;
    }
    ?>
    <nav class="dbw-callbar" aria-label="Schnellkontakt">
        <a class="dbw-callbar__btn dbw-callbar__btn--call" href="tel:+4971349064140">
            <svg aria-hidden="true" viewBox="0 0 512 512"><path fill="currentColor" d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"/></svg>
            Anrufen
        </a>
        <a class="dbw-callbar__btn dbw-callbar__btn--form smooth-scroll" href="<?php echo esc_url(home_url('/#kontakt')); ?>">
            Termin anfragen
        </a>
    </nav>
    <?php
});

// The "Animate on Scroll" plugin is replaced by CSS scroll-driven animations
// (src/sass/components/_reveal.scss); its JS and CSS are no longer needed.
add_action('wp_enqueue_scripts', function () {
    wp_dequeue_script('aoswp-script');
    wp_dequeue_style('aoswp-style');
}, 100);
