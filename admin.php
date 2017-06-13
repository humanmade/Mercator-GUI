<?php

namespace Mercator\GUI;

use Mercator\Mapping;

const VERSION = '0.1';

add_action( 'admin_menu', __NAMESPACE__ . '\\menu_item' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
add_action( 'wp_ajax_mercator-gui', __NAMESPACE__ . '\\handle_ajax' );

function menu_item() {
	add_options_page(
		__( 'Domain settings', 'mercator' ),
		__( 'Domains', 'mercator' ),
		'manage_options',
		'mercator-gui',
		__NAMESPACE__ . '\\settings_page'
	);
}

function settings_page() {
	include 'views/settings.php';
}

function enqueue_scripts( $hook ) {
	if ( 'settings_page_mercator-gui' !== $hook ) {
		return;
	}

	// Initial data object, for fast loading fun times
	$data = array(
		'api'   => admin_url( '/admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'wp_rest' ),
		'data'  => array(
			'aliases'  => array_map(
				__NAMESPACE__ . '\\mapping_to_array',
				Mapping::get_by_site( get_current_blog_id() )
			),
			'site'     => get_site( get_current_blog_id() ),
			'mainSite' => get_site( get_main_site_for_network() ),
		),
		'l10n'  => array(
			'areYouSure'          => __( 'Are you sure?', 'mercator' ),
			'aliasInvalidError'   => __( 'Domain cannot be empty and must be a valid host name', 'mercator' ),
			'aliasSubdomainError' => __( 'You can only have one subdomain on the network', 'mercator' ),
		),
	);

	wp_enqueue_style(
		'mercator-gui',
		plugins_url( 'assets/css/gui.css', __FILE__ ),
		array(),
		filemtime( __DIR__ . '/assets/' )
	);

	wp_enqueue_script(
		'mercator-gui',
		plugins_url( 'assets/js/gui.js', __FILE__ ),
		array( 'jquery', 'backbone', 'underscore' ),
		VERSION,
		true
	);

	wp_add_inline_script(
		'mercator-gui',
		sprintf(
			'<script>var mercator = %s;</script>',
			wp_json_encode( $data )
		), 'before'
	);
}

function mapping_to_array( $mapping ) {
	return array(
		'id'     => absint( $mapping->get_id() ),
		'domain' => $mapping->get_domain(),
		'active' => $mapping->is_active(),
	);
}
