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
	<div class="mercator-errors"></div>
	<ul class="mercator-alias-list"></ul>
	<button class="mercator-alias-add button button-primary"><?php esc_html_e( 'Add an alias', 'mercator' ); ?></button>
</script>
<script type="text/template" id="tmpl-mercator-primary-domain">
	<p>
		<strong><?php esc_html_e( 'This is your primary domain', 'mercator' ); ?></strong>,
		<?php esc_html_e( 'the domains listed below will redirect to this one' ) ?>
	</p>
	<h2><%= domain %></h2>
</script>
<script type="text/template" id="tmpl-mercator-alias">
	<input class="mercator-alias-domain" type="text" placeholder="<?php esc_attr_e( 'example.com, hit Enter to save', 'mercator' ); ?>" pattern="([a-z0-9]+\.)?([a-z0-9_-]+\.[a-z]+)(\.[a-z]+)" value="<%- domain %>" />
	<span class="mercator-alias-controls">
		<label class="mercator-alias-active-label">
			<input class="mercator-alias-active" type="checkbox" <%= active ? 'checked' : '' %> />
			<?php esc_html_e( 'Active', 'mercator' ); ?>
		</label>
		<button class="mercator-alias-update button button-primary"><?php esc_html_e( 'Update', 'mercator' ); ?></button>
		<button class="mercator-alias-delete button button-secondary"><?php esc_html_e( 'Delete', 'mercator' ); ?></button>
		<button class="mercator-alias-ays button button-secondary" style="display:none"><?php esc_html_e( 'Are you sure?', 'mercator' ); ?></button>
		<button class="mercator-alias-cancel button button-secondary" style="display:none"><?php esc_html_e( 'Cancel', 'mercator' ); ?></button>
	</span>
</script>