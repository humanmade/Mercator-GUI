var mercator = mercator || {};

var ENTER_KEY = 13;

(function ( $ ) {
  'use strict';

  /**
   * Custom sync method, map methods to our REST API
   *
   * @param method
   * @param model
   * @param options
   */
  mercator.sync = function ( method, model, options ) {

    // Map backbone methods
    method = 'create' === method ? 'post' : method;
    method = 'read' === method ? 'get' : method;
    method = 'update' === method ? 'put' : method;

    var data = model.toJSON(),
        url  = ( model.collection ? model.collection.url : model.url ) +
               ( _.isObject( data ) && data.id ? '/' + data.id : '' ),
        opts = _.extend( {
          url        : url,
          beforeSend : function ( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', mercator.nonce );
          },
          dataType   : 'json',
          contentType: 'application/json',
          data       : JSON.stringify(
            'patch' === method ?
              model.changedAttributes() :
              model.toJSON()
          ),
          method     : method.toUpperCase()
        }, options );

    model.trigger( 'request', model, method );

    $.ajax( opts )
      .fail( function ( xhr ) {
        model.trigger( 'invalid', model, xhr.responseJSON );
        model.trigger( 'complete', model );
      } );
  };

  /**
   * RegExp helper
   */
  mercator.subdomainRegExp = new RegExp( mercator.data.mainSite.domain + '$' );

  /**
   * Alias model, collection & view
   */
  mercator.Alias = Backbone.Model.extend( {

    sync: mercator.sync,

    defaults: {
      domain: '',
      active: false
    },

    validate: function ( attrs, options ) {
      if ( !attrs.domain || !attrs.domain.match( /[a-z0-9._-]+\.[a-z0-9._-]+/i ) ) {
        return {
          attribute: 'domain',
          message  : mercator.l10n.aliasInvalidError
        };
      }
      if ( attrs.domain && attrs.domain.match( mercator.subdomainRegExp ) ) {
        return {
          attribute: 'domain',
          message  : mercator.l10n.aliasSubdomainError
        };
      }
    }

  } );

  var Aliases = Backbone.Collection.extend( {

    url: '/wp-json/mercator/v1/mappings',

    sync: mercator.sync,

    // Reference to this collection's model.
    model: mercator.Alias,

    // Sort by id
    comparator: 'id'

  } );

  mercator.Aliases = new Aliases();

  mercator.AliasView = Backbone.View.extend( {

    tagName  : 'li',
    className: 'mercator-alias',

    template: _.template( $( '#tmpl-mercator-alias' ).html() ),

    events: {
      'click .mercator-alias-update' : 'updateAlias',
      'click .mercator-alias-active' : 'toggleAlias',
      'click .mercator-alias-delete' : 'areYouSure',
      'click .mercator-alias-ays'    : 'deleteAlias',
      'click .mercator-alias-cancel' : 'cancelDelete',
      'click .mercator-alias-primary': 'makePrimary',
      'keyup .mercator-alias-domain' : 'updateAlias'
    },

    initialize: function () {
      this.listenTo( this.model, 'invalid', this.showError );
      this.listenTo( this.model, 'request', this.onRequest );
      this.listenTo( this.model, 'sync', this.onSync );
      this.listenTo( this.model, 'sync', this.onComplete );
      this.listenTo( this.model, 'complete', this.onComplete );
    },

    render: function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      this.$domain = this.$( '.mercator-alias-domain' );
      this.$active = this.$( '.mercator-alias-active' );
      this.$primary = this.$( '.mercator-alias-primary' );
      this.$controls = this.$( '.mercator-alias-controls' );
      this.$update = this.$( '.mercator-alias-update' );
      this.$ays = this.$( '.mercator-alias-ays' );
      this.$delete = this.$( '.mercator-alias-delete' );
      this.$cancel = this.$( '.mercator-alias-cancel' );

      // Only allow active aliases to be made primary
      this.$primary.toggle( this.$active.is( ':checked' ) );

      // Readonly and no controls if it's a network subdomain or subfolder
      if ( this.model.get( 'domain' ).match( mercator.subdomainRegExp ) ) {
        this.$domain.attr( 'readonly', 'readonly' );
        this.$active.parent().remove();
        this.$( 'button' ).not( this.$primary ).remove();
      }

      // Only show active if model not new
      if ( this.model.isNew() ) {
        this.$active.parent().hide();
      }

      return this;
    },

    areYouSure: function () {
      this.$( 'button' ).hide();
      this.$ays.show();
      this.$cancel.show();
    },

    deleteAlias: function () {
      this.model.destroy();
      this.$el.fadeOut( 250 );
    },

    cancelDelete: function () {
      this.$( 'button' ).show();
      this.$ays.hide();
      this.$cancel.hide();
    },

    updateAlias: function ( e ) {
      this.hideError();

      if ( 'keyup' === e.type && e.key && e.key !== 'Enter' ) {
        return;
      }
      if ( 'keyup' === e.type && e.keyCode && e.keyCode !== ENTER_KEY ) {
        return;
      }

      this.model.save( {
        domain: this.$domain.val()
      }, {
        patch: !this.model.isNew() // create if new, patch otherwise
      } );
    },

    toggleAlias: function () {
      this.$primary.toggle( this.$active.is( ':checked' ) );
      this.model.set( {
        active: this.$active.is( ':checked' )
      } );
      if ( !this.model.isNew() ) {
        this.model.save( null, {
          patch: true
        } );
      }
    },

    showError: function ( model, error ) {
      this.$el
        .append(
          $( '<p/>', {
            "class": "mercator-alias-error notice notice-error"
          } )
            .text( error.message )
            .fadeIn( 250 )
            .css( { display: 'inline-block' } )
        );
      if ( 'domain' === error.attribute || ( error.data && 'domain' === error.data.attribute ) ) {
        this.$domain.focus().select();
      }
    },

    hideError: function () {
      this.$el.find( '.mercator-alias-error' ).fadeOut( 250, function () {
        $( this ).remove();
      } );
    },

    onRequest: function () {
      this.$el.find( 'button, input' ).attr( 'disabled', 'disabled' ).addClass( 'disabled' );
    },

    onSync: function () {
      this.hideError();
      this.$active.parent().show();
      this.$domain.val( this.model.get( 'domain' ) );
    },

    onComplete: function () {
      this.$el.find( 'button, input' ).removeAttr( 'disabled' ).removeClass( 'disabled' );
    },

    makePrimary: function () {
      this.$el.fadeOut( 250 );

      mercator.PrimaryData.at( 0 ).set( {
        domain: this.model.get( 'domain' )
      } ).save( {
        mapping: this.model.id
      }, {
        success: function () {
          mercator.Aliases.fetch();
        }
      } );
    }

  } );

  /**
   * Primary domain model, collection & view
   */
  mercator.Primary = Backbone.Model.extend( {

    sync: mercator.sync,

    defaults: {
      blog_id: 0,
      domain : '',
      site_id: 0,
      path   : '/'
    }

  } );

  var Primary = Backbone.Collection.extend( {

    url: '/wp-json/mercator/v1/primary',

    model: mercator.Primary

  } );

  mercator.PrimaryData = new Primary( [ mercator.data.site ] );

  mercator.PrimaryView = Backbone.View.extend( {

    tagName  : 'div',
    className: 'mercator-primary-domain',

    template: _.template( $( '#tmpl-mercator-primary-domain' ).html() ),

    initialize: function () {
      this.listenTo( this.model, 'change', this.render );
    },

    render: function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      this.$( '.mercator-primary-domain-value' ).fadeIn( 250 );
      return this;
    }

  } );

  /**
   * Main GUI view
   */
  mercator.GUI = Backbone.View.extend( {

    el: '.mercator-gui',

    template: _.template( $( '#tmpl-mercator-gui' ).html() ),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'click .mercator-alias-add': 'newAlias'
    },

    initialize: function () {
      // Get one off primary domain view
      this.primaryDomain = new mercator.PrimaryView( { model: mercator.PrimaryData.at( 0 ) } );

      // Create markup
      this.render();

      this.$list = this.$( '.mercator-alias-list' );

      this.listenTo( mercator.Aliases, 'add', this.addAlias );
      this.listenTo( mercator.Aliases, 'reset', this.addAll );

      // Populate initial data
      mercator.Aliases.reset( mercator.data.aliases );
    },

    render: function () {
      this.$el.html( this.template() );
      this.$el.prepend( this.primaryDomain.render().el );
      return this;
    },

    newAlias: function () {
      var alias = new mercator.Alias;
      mercator.Aliases.push( alias ); // Using push so we don't render
    },

    addAlias: function ( alias ) {
      var view = new mercator.AliasView( { model: alias } );
      this.$list.append( view.render().$el.fadeIn( 250 ) );
      if ( alias.isNew() ) {
        view.$domain.focus();
      }
    },

    addAll: function () {
      this.$list.html( '' );
      mercator.Aliases.each( this.addAlias, this );
    }

  } );

  // Load
  new mercator.GUI();

})( jQuery );
