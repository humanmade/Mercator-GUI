<?php

namespace Mercator\GUI;

use Mercator\Mapping;
use WP_Error;

const VERSION = '0.1';

add_action( 'admin_menu', __NAMESPACE__ . '\\menu_item' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
add_action( 'wp_ajax_mercator', __NAMESPACE__ . '\\handle_ajax' );

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

	$data = array(
		'api'   => admin_url( '/admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'mercator-gui' ),
		'data'  => array(
			'aliases' => array_map( function ( $mapping ) {
				return array(
					'id'     => absint( $mapping->get_id() ),
					'domain' => $mapping->get_domain(),
					'active' => $mapping->is_active(),
				);
			}, Mapping::get_by_site( get_current_blog_id() ) ),
			'site'    => get_site( get_current_blog_id() ),
		),
	);

	wp_enqueue_script( 'mercator-gui', plugins_url( 'assets/js/gui.js', __FILE__ ), array( 'jquery', 'backbone', 'underscore' ), VERSION, true );
	wp_add_inline_script( 'mercator-gui', sprintf(
		'<script>var mercator = %s;</script>',
		wp_json_encode( $data )
	), 'before' );
}

function handle_ajax() {
	check_ajax_referer( 'mercator-gui' );

	if ( ! isset( $_REQUEST['doAction'] ) ) {
		return;
	}

	switch ( $_REQUEST['doAction'] ) {
		case 'fetch':
			$aliases = array_map( function ( $mapping ) {
				return array(
					'id'     => absint( $mapping->get_id() ),
					'domain' => $mapping->get_domain(),
					'active' => $mapping->is_active(),
				);
			}, Mapping::get_by_site( get_current_blog_id() ) );
			wp_send_json( $aliases );
			break;
	}
}
