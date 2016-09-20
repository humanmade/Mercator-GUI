# Mercator GUI
Admin interface component for [Mercator](https://github.com/humanmade/Mercator).

Allows you to manage aliases via the WP network admin.

## Requirements
Mercator requires WordPress 3.9 or newer for the new sunrise processes. Mercator
also requires PHP 5.3+ due to the use of namespaced code.

## Installation
Include the file `gui.php` from your `sunrise.php` in the same way you include Mercator itself.

**NOTE** include `gui.php` before `mercator.php` itself!

For example:

```php
<?php
// Default mu-plugins directory if you haven't set it
defined( 'WPMU_PLUGIN_DIR' ) or define( 'WPMU_PLUGIN_DIR', WP_CONTENT_DIR . '/mu-plugins' );

require WPMU_PLUGIN_DIR . '/mercator-gui/gui.php';
require WPMU_PLUGIN_DIR . '/mercator/mercator.php';
```

## License
Mercator is licensed under the GPLv2 or later.

## Credits
Created by Human Made for high volume and large-scale sites, such as [Happytables](http://happytables.com/). We run Mercator on sites with millions of monthly page views, and thousands of sites.

Written and maintained by [Ryan McCue](https://github.com/rmccue). Thanks to all our [contributors](https://github.com/humanmade/Mercator/graphs/contributors).

Mercator builds on concepts from [WPMU Domain Mapping][], written by Donncha O'Caoimh, Ron Rennick, and contributors.

Mercator relies on WordPress core, building on core functionality added in [WP27003][]. Thanks to all involved in the overhaul, including Andrew Nacin and Jeremy Felt.

[WPMU Domain Mapping]: http://wordpress.org/plugins/wordpress-mu-domain-mapping/
[WP27003]: https://core.trac.wordpress.org/ticket/27003

Interested in joining in on the fun? [Join us, and become human!](https://hmn.md/is/hiring/)
