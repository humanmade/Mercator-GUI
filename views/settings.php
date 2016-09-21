<?php
/**
 * Settings view for site level admin
 */
?>

<div class="wrap">
	<h1><?php esc_html_e( 'Domain settings', 'mercator' ); ?></h1>
	<p class="intro"><?php esc_html_e( 'You can add and edit aliases here.' ); ?></p>
	<div class="mercator-gui"></div>
</div>

<script type="text/template" id="tmpl-mercator-gui">
	<ul class="mercator-alias-list"></ul>
	<button class="mercator-alias-add button button-primary"><?php esc_html_e( 'Add an alias', 'mercator' ); ?></button>
</script>
<script type="text/template" id="tmpl-mercator-primary-domain">
	<h2><%= domain %></h2>
	<p>
		<strong><?php esc_html_e( 'Primary domain', 'mercator' ); ?></strong>,
		<?php esc_html_e( 'the domains listed below will redirect to this one' ) ?>
	</p>
</script>
<script type="text/template" id="tmpl-mercator-alias">
	<input class="mercator-alias-domain" type="text" pattern="([a-z0-9]+\.)?([a-z0-9_-]+\.[a-z]+)(\.[a-z]+)" value="<%- domain %>" />
	<button class="mercator-alias-update button button-primary"><?php esc_html_e( 'Update', 'mercator' ); ?></button>
	<label>
		<input class="mercator-alias-active" type="checkbox" <%= active ? 'checked' : '' %> />
		<?php esc_html_e( 'Active', 'mercator' ); ?>
	</label>
	<button class="mercator-alias-delete button button-secondary deletion"><?php esc_html_e( 'Delete', 'mercator' ); ?></button>
</script>