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
	<h2>Aliases</h2>
	<div class="mercator-errors"></div>
	<ul class="mercator-alias-list"></ul>
	<button class="mercator-alias-add button button-primary"><?php esc_html_e( 'Add an alias', 'mercator' ); ?></button>
</script>
<script type="text/template" id="tmpl-mercator-primary-domain">
	<h2><?php esc_html_e( 'Primary domain', 'mercator' ); ?></h2>
	<p class="mercator-primary-domain-value"><%= domain %></p>
	<hr />
</script>
<script type="text/template" id="tmpl-mercator-alias">
	<input class="mercator-alias-domain" type="text" placeholder="<?php esc_attr_e( 'example.com, hit Enter to save', 'mercator' ); ?>" pattern="([a-z0-9]+\.)?([a-z0-9_-]+\.[a-z]+)(\.[a-z]+)" value="<%- domain %>" />
	<label class="mercator-alias-active-label">
		<input class="mercator-alias-active" type="checkbox" <%= active ? 'checked' : '' %> />
		<?php esc_html_e( 'Active', 'mercator' ); ?>
	</label>
	<div class="mercator-alias-controls">
		<button class="mercator-alias-update button button-secondary"><?php esc_html_e( 'Update', 'mercator' ); ?></button>
		<button class="mercator-alias-delete button button-secondary"><?php esc_html_e( 'Delete', 'mercator' ); ?></button>
		<button class="mercator-alias-ays button button-secondary" style="display:none"><?php esc_html_e( 'Are you sure?', 'mercator' ); ?></button>
		<button class="mercator-alias-cancel button button-secondary" style="display:none"><?php esc_html_e( 'Cancel', 'mercator' ); ?></button>
		<button class="mercator-alias-primary button button-secondary"><?php esc_html_e( 'Make primary', 'mercator' ); ?></button>
	</div>
</script>
