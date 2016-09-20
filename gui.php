<?php
/**
 * Mercator GUI
 *
 * WordPress multisite domain mapping admin.
 *
 * @package Mercator
 */

namespace Mercator\GUI;

/**
 * Current version of Mercator GUI.
 */
const VERSION = '0.1';

add_action( 'mercator_load', __NAMESPACE__ . '\\admin_init' );

function is_network_enabled() {
	return apply_filters( 'mercator.gui.network.enabled', true );
}

function admin_init() {
	// Remove old plugin admin action for back compat
	remove_action( 'admin_init', 'Mercator\\load_admin', -100 );

	if ( is_network_enabled() ) {
		add_action( 'admin_init', __NAMESPACE__ . '\\load_network_admin', -100 );
	}
}

/**
 * Load administration functions
 *
 * We do this here rather than just including it to avoid extra load on
 * non-admin pages.
 */
function load_network_admin() {
	require_once __DIR__ . '/network-admin.php';
	require_once __DIR__ . '/inc/admin/class-alias-list-table.php';
}
