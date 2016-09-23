<?php
/**
 * Mercator GUI
 *
 * WordPress multisite domain mapping admin.
 *
 * @package Mercator
 */

namespace Mercator\GUI;

use Mercator\REST_API;

/**
 * Current version of Mercator GUI.
 */
const VERSION = '0.1';

add_action( 'mercator_load', __NAMESPACE__ . '\\admin_init' );
add_action( 'rest_api_init', __NAMESPACE__ . '\\rest_api_init' );

function is_enabled() {
	/**
	 * Whether to load the site level admin interface or not
	 *
	 * @param bool If true loads the admin interface
	 */
	return apply_filters( 'mercator.gui.enabled', true );
}

function is_network_enabled() {
	/**
	 * Whether to load the network admin interface or not
	 *
	 * @param bool If true loads the network interface
	 */
	return apply_filters( 'mercator.gui.network.enabled', true );
}

function admin_init() {
	// Remove old plugin admin action for back compat
	remove_action( 'admin_init', 'Mercator\\load_admin', -100 );

	if ( is_admin() && ! is_network_admin() && is_enabled() ) {
		add_action( 'admin_menu', __NAMESPACE__ . '\\load_admin', -100 );
	}

	if ( is_network_admin() && is_network_enabled() ) {
		add_action( 'admin_init', __NAMESPACE__ . '\\load_network_admin', -100 );
	}
}

/**
 * Load administration functions
 *
 * We do this here rather than just including it to avoid extra load on
 * non-admin pages.
 */
function load_admin() {
	require_once __DIR__ . '/admin.php';
}

/**
 * Load network administration functions
 *
 * We do this here rather than just including it to avoid extra load on
 * non-admin pages.
 */
function load_network_admin() {
	require_once __DIR__ . '/network-admin.php';
	require_once __DIR__ . '/inc/admin/class-alias-list-table.php';
}

/**
 * Load REST Controller
 */
function rest_api_init() {
	if ( class_exists( 'Mercator\API' ) ) {
		return;
	}
	require_once __DIR__ . '/inc/api/class-rest-api.php';

	// Comments.
	$controller = new REST_API;
	$controller->register_routes();
}
