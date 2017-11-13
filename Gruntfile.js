/* jshint node:true */
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({

		// Load package data
		pkg: grunt.file.readJSON('package.json'),

		// Generate .pot file
		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					exclude: [],
					potFilename: 'mercator-gui.pot',
					processPot: function( pot ) {
						pot.headers['report-msgid-bugs-to'] = 'https://github.com/humanmade/Mercator-GUI/issues\n';
						pot.headers['plural-forms'] = 'nplurals=2; plural=n != 1;';
						pot.headers['x-poedit-basepath'] = '.\n';
						pot.headers['x-poedit-language'] = 'English\n';
						pot.headers['x-poedit-country'] = 'United States\n';
						pot.headers['x-poedit-sourcecharset'] = 'utf-8\n';
						pot.headers['x-poedit-keywordslist'] = '__;_e;__ngettext:1,2;_n:1,2;__ngettext_noop:1,2;_n_noop:1,2;_c,_nc:4c,1,2;_x:1,2c;_ex:1,2c;_nx:4c,1,2;_nx_noop:4c,1,2;\n';
						pot.headers['x-poedit-bookmarks'] = '\n';
						pot.headers['x-poedit-searchpath-0'] = '.\n';
						pot.headers['x-textdomain-support'] = 'yes\n';
						// Exclude string without textdomain and plugin's meta data
						var translation, delete_translation,
							excluded_strings = [],
							excluded_meta = [ 'Plugin Name of the plugin/theme', 'Plugin URI of the plugin/theme', 'Author of the plugin/theme', 'Author URI of the plugin/theme' ];
						for ( translation in pot.translations[''] ) {
							delete_translation = false;
							if ( excluded_strings.indexOf( translation ) >= 0 ) {
								delete_translation = true;
								console.log( 'Excluded string: ' + translation );
							}
							if ( typeof pot.translations[''][translation].comments.extracted !== 'undefined' ) {
								if ( excluded_meta.indexOf( pot.translations[''][translation].comments.extracted ) >= 0 ) {
									delete_translation = true;
									console.log( 'Excluded meta: ' + pot.translations[''][translation].comments.extracted );
								}
							}
							if ( delete_translation ) {
								delete pot.translations[''][translation];
							}
						}
						return pot;
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

		// Check plugin text domain
		checktextdomain: {
			options:{
				text_domain: 'mercator-gui',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d'
				],
				report_missing: true
			},
			files: {
				src:  [
					'**/*.php',
					'!node_modules/**',
					'!build/**'
				],
				expand: true
			}
		}

	});

	// Load NPM tasks to be used here
	require( 'load-grunt-tasks' )( grunt );

	// Register tasks
	grunt.registerTask( 'default', [
		'languages'
	]);

	grunt.registerTask( 'languages', [
		'checktextdomain',
		'makepot'
	]);

};