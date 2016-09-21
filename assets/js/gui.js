var mercator = mercator || {};

var ENTER_KEY = 13;
var ESC_KEY   = 27;

(function( $ ) {
  'use strict';

  mercator.Alias = Backbone.Model.extend( {
    // Default attributes for the alias
    defaults: {
      id    : 0,
      domain: '',
      active: false
    },

    urlRoot: mercator.api,

    save: function( attrs, options ) {
      options.type = 'POST';
      options.data = options.data || {};
      options.data = _.extend( options.data, {
        action  : 'mercator',
        doAction: 'save',
        nonce   : mercator.nonce
      } );

      return Backbone.Model.prototype.save.call( this, attrs, options );
    },

    destroy: function() {

    },

    // Toggle the `active` state of this alias
    setActive: function() {
      this.save( {
        active: !this.get( 'active' )
      } );
    },

    setDomain: function() {
      this.save( {
        domain: this.get( 'domain' )
      } );
    }
  } );

  // The collection of aliases is backed by *localStorage* instead of a remote
  // server.
  var Aliases = Backbone.Collection.extend( {

    url: mercator.api,

    fetch: function( options ) {
      options.type = 'POST';
      options.data = options.data || {};
      options.data = _.extend( options.data, {
        action  : 'mercator',
        doAction: 'fetch',
        nonce   : mercator.nonce
      } );

      return Backbone.Collection.prototype.fetch.call( this, options );
    },

    // Reference to this collection's model.
    model: mercator.Alias,

    // Filter down the list of all todo items that are finished.
    active: function() {
      return this.where( { active: true } );
    }

  } );

  mercator.Aliases = new Aliases();

  mercator.AliasView = Backbone.View.extend( {

    tagName  : 'li',
    className: 'mercator-alias',

    template: _.template( $( '#tmpl-mercator-alias' ).html() ),

    events: {
      'click .mercator-alias-update'   : 'updateAlias',
      'click .mercator-alias-active'   : 'toggleAlias',
      'click .mercator-alias-delete'   : 'deleteAlias',
      'keypress .mercator-alias-domain': 'updateAlias'
    },

    initialize: function() {
      this.$domain = this.$( '.mercator-alias-domain' );
      this.$active = this.$( '.mercator-alias-active' );

      this.listenTo( this.model, 'change', this.render );
      this.listenTo( this.model, 'destroy', this.remove );
    },

    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    },

    deleteAlias: function() {

    },

    updateAlias: function() {

    },

    toggleAlias: function() {

    }

  } );

  mercator.GUI = Backbone.View.extend( {

    el: '.mercator-gui',

    template       : _.template( $( '#tmpl-mercator-gui' ).html() ),
    templatePrimary: _.template( $( '#tmpl-mercator-primary-domain' ).html() ),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click .mercator-alias-add': 'addAlias'
    },

    initialize: function() {
      // Create markup
      this.render();

      this.$list = this.$( '.mercator-alias-list' );

      this.listenTo( mercator.Aliases, 'add', this.addAlias );
      this.listenTo( mercator.Aliases, 'reset', this.addAll );

      // Populate initial data
      mercator.Aliases.reset( mercator.data.aliases );
    },

    render: function() {

      this.$el.html( this.template( {
        primary: this.templatePrimary( mercator.data.site )
      } ) );

      return this;
    },

    addAlias: function( alias ) {
      var view = new mercator.AliasView( { model: alias } );
      this.$list.append( view.render().el );
    },

    // Add all items in the **Aliases** collection at once.
    addAll: function() {
      this.$list.html( '' );
      mercator.Aliases.each( this.addAlias, this );
    }

  } );

  // Load
  new mercator.GUI();

})( jQuery );