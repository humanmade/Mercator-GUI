var mercator = mercator || {};

var ENTER_KEY = 13;

(function( $ ) {
  'use strict';

  mercator.sync = function( method, model, options ) {

    // Map backbone methods
    method = 'create' === method ? 'post' : method;
    method = 'read' === method ? 'get' : method;
    method = 'update' === method ? 'put' : method;

    var data = model.toJSON(),
        url  = '/wp-json/mercator/v1/mappings' +
          ( _.isObject( data ) && data.id ? '/' + data.id : '' ),
        opts = _.extend( {
          url       : url,
          beforeSend: function( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', mercator.nonce );
          },
          data      : model.toJSON(),
          method    : method.toUpperCase()
        }, options );

    $.ajax( opts );
  };

  mercator.Alias = Backbone.Model.extend( {

    sync: mercator.sync,

    defaults: {
      domain: '',
      active: false
    },

    validate: function( attrs, options ) {
      console.log( attrs, options )
      if ( !attrs.domain || !attrs.domain.match( /[a-z0-9._-]+\.[a-z0-9._-]+/i ) ) {
        return {
          attribute: 'domain',
          message  : mercator.l10n.domainError
        };
      }
    }

  } );

  var Aliases = Backbone.Collection.extend( {

    url: '/wp-json/mercator/v1/mappings',

    sync: mercator.sync,

    // Reference to this collection's model.
    model: mercator.Alias,

    // Filter down the list of all todo items that are finished.
    active: function() {
      return this.where( {
        active: true
      } );
    }

  } );

  mercator.Aliases = new Aliases();

  mercator.AliasView = Backbone.View.extend( {

    tagName  : 'li',
    className: 'mercator-alias',

    template: _.template( $( '#tmpl-mercator-alias' ).html() ),

    events: {
      'click .mercator-alias-update': 'updateAlias',
      'click .mercator-alias-active': 'toggleAlias',
      'click .mercator-alias-delete': 'deleteAlias',
      'keyup .mercator-alias-domain': 'updateAlias'
    },

    initialize: function() {
      this.listenTo( this.model, 'change', this.render );
      this.listenTo( this.model, 'invalid', this.showError );
      this.listenTo( this.model, 'request', this.onRequest );
      this.listenTo( this.model, 'sync', this.onSync );
    },

    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      this.$domain = this.$( '.mercator-alias-domain' );
      this.$active = this.$( '.mercator-alias-active' );
      this.$update = this.$( '.mercator-alias-update' );
      return this;
    },

    deleteAlias: function() {
      this.$el.remove();
      this.model.destroy();
    },

    updateAlias: function( e ) {
      this.hideError();

      if ( e.type === 'keyup' && ( (e.which && e.which !== ENTER_KEY) || (e.key && e.key !== 'Enter') ) ) {
        return;
      }

      this.model.save( {
        domain: this.$domain.val()
      }, {
        patch: !this.model.isNew() // create if new, patch otherwise
      } );
    },

    toggleAlias: function() {
      if ( !this.model.isNew() ) {
        this.model.save( {
          active: this.$active.is( ':checked' )
        }, {
          patch: true
        } );
      }
    },

    showError: function( model, error ) {
      this.$el
        .append(
          $( '<p/>', {
            "class": "mercator-alias-error",
            "style": "display:none;"
          } )
            .text( error.message )
            .fadeIn( 200 )
        );
      if ( 'domain' === error.attribute ) {
        this.$domain.focus().select();
      }
    },

    hideError: function() {
      this.$el.find( '.mercator-alias-error' ).remove();
    },

    onRequest: function() {
      this.$update.attr( 'disabled', 'disabled' );
    },

    onSync: function() {
      this.$update.removeAttr( 'disabled' );
    }

  } );

  mercator.Primary = Backbone.Model.extend( {
    defaults: {
      blog_id: 0,
      domain : '',
      site_id: 0,
      path   : '/'
    }
  } );

  mercator.PrimaryView = Backbone.View.extend( {

    tagName  : 'div',
    className: 'mercator-primary-domain',

    template: _.template( $( '#tmpl-mercator-primary-domain' ).html() ),

    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this;
    }

  } );

  mercator.GUI = Backbone.View.extend( {

    el: '.mercator-gui',

    template: _.template( $( '#tmpl-mercator-gui' ).html() ),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click .mercator-alias-add': 'newAlias'
    },

    initialize: function() {
      // Get one off primary domain view
      this.primaryModel  = new mercator.Primary( mercator.data.site );
      this.primaryDomain = new mercator.PrimaryView( { model: this.primaryModel } );

      // Create markup
      this.render();

      this.$list = this.$( '.mercator-alias-list' );

      this.listenTo( mercator.Aliases, 'add', this.addAlias );
      this.listenTo( mercator.Aliases, 'reset', this.addAll );

      // Populate initial data
      mercator.Aliases.reset( mercator.data.aliases );
    },

    render: function() {
      this.$el.html( this.template() );
      this.$el.prepend( this.primaryDomain.render().el );
      return this;
    },

    newAlias: function() {
      var alias = new mercator.Alias;
      mercator.Aliases.push( alias ); // Using push so we don't
    },

    addAlias: function( alias ) {
      var view = new mercator.AliasView( { model: alias } );
      this.$list.append( view.render().el );
      if ( alias.isNew() ) {
        view.$domain.focus();
      }
    },

    addAll: function() {
      this.$list.html( '' );
      mercator.Aliases.each( this.addAlias, this );
    }

  } );

  // Load
  new mercator.GUI();

})( jQuery );