<?php
/**
 * SEO output tweaks for Rank Math.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Rank Math adds Slack "Written by / Time to read" labels to every page.
// On a business one-pager they are noise and leak the login name ("admin").
add_action('wp_head', function () {
    remove_all_actions('rank_math/opengraph/slack');
}, 0);

/**
 * Local business schema (AutoRepair) on the front page.
 * Rank Math only outputs a generic Organization; for local search Google
 * needs address, phone and opening hours as structured data.
 */
add_action('wp_head', function () {
    if (!is_front_page()) {
        return;
    }

    $schema = array(
        '@context'    => 'https://schema.org',
        '@type'       => 'AutoRepair',
        '@id'         => home_url('/#autorepair'),
        'name'        => 'Reifenservice Schedler',
        'description' => 'Markenunabhängiger Reifenservice in Obersulm-Willsbach: Reifenwechsel, Reifeneinlagerung, Achsvermessung, Fahrwerk, Felgen und Bremsenservice.',
        'url'         => home_url('/'),
        'telephone'   => '+49 7134 9064140',
        'email'       => 'info@reifenservice-schedler.de',
        'image'       => get_stylesheet_directory_uri() . '/assets/img/Reifenservice-Schedler-Logo-Weiss.webp',
        'address'     => array(
            '@type'           => 'PostalAddress',
            'streetAddress'   => 'Neuhausstraße 3',
            'postalCode'      => '74182',
            'addressLocality' => 'Obersulm-Willsbach',
            'addressRegion'   => 'Baden-Württemberg',
            'addressCountry'  => 'DE',
        ),
        'openingHoursSpecification' => array(
            array(
                '@type'     => 'OpeningHoursSpecification',
                'dayOfWeek' => array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
                'opens'     => '08:00',
                'closes'    => '12:00',
            ),
            array(
                '@type'     => 'OpeningHoursSpecification',
                'dayOfWeek' => array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
                'opens'     => '13:00',
                'closes'    => '17:30',
            ),
        ),
        'areaServed'  => array('Obersulm', 'Weinsberg', 'Ellhofen', 'Löwenstein', 'Bretzfeld', 'Öhringen', 'Heilbronn'),
    );

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
}, 20);

/**
 * FAQPage schema built from the accordion on the page itself, so questions
 * edited in the block editor never drift from the structured data.
 */
add_filter('render_block_generateblocks-pro/accordion-item', function ($html) {
    if (!is_front_page() || !class_exists('DOMDocument')) {
        return $html;
    }

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML('<?xml encoding="utf-8"?><div>' . $html . '</div>');
    libxml_clear_errors();
    $xpath = new DOMXPath($dom);

    $toggle  = $xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " gb-accordion__toggle ")]')->item(0);
    $content = $xpath->query('//*[contains(concat(" ", normalize-space(@class), " "), " gb-accordion__content ")]')->item(0);

    if ($toggle && $content) {
        $question = trim(preg_replace('/\s+/', ' ', $toggle->textContent));
        $answer   = trim(preg_replace('/\s+/', ' ', $content->textContent));
        if ($question && $answer) {
            $GLOBALS['dbw_faq_items'][] = array($question, $answer);
        }
    }

    return $html;
});

add_action('wp_footer', function () {
    if (empty($GLOBALS['dbw_faq_items'])) {
        return;
    }

    $schema = array(
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        'mainEntity' => array_map(function ($item) {
            return array(
                '@type'          => 'Question',
                'name'           => $item[0],
                'acceptedAnswer' => array('@type' => 'Answer', 'text' => $item[1]),
            );
        }, $GLOBALS['dbw_faq_items']),
    );

    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
});

/**
 * Pages are not articles: drop Rank Math's Article and author Person nodes
 * (the Person exposes the login name "admin").
 */
add_filter('rank_math/json_ld', function ($data) {
    if (!is_page()) {
        return $data;
    }
    foreach ($data as $key => $entity) {
        $type = is_array($entity) && isset($entity['@type']) ? (array) $entity['@type'] : array();
        if (array_intersect($type, array('Article', 'BlogPosting', 'NewsArticle', 'Person'))) {
            unset($data[$key]);
        }
    }
    return $data;
}, 99);
