(function (){
  var root = this;

  root.App = {};

  App.VERSION = '0.0.1';

  // Find a suitable DOM library
  App.$ = root.jQuery || root.zepto || false;

  App.Game = function( attributes ) {
    attributes = App.Helpers.verifyAttributes( attributes );

    var defaults = {
      canvas_container_id: 'game',
      color: '#f7f7f7',
      width: 640,
      height: 480,
      total_debris: 20,
      point_multiplier: 10,
      powerup_delay: 5000
    };

    this.attributes = _.defaults( attributes, defaults );

    this.container = document.getElementById( this.attributes.canvas_container_id );

    this.layer = new App.BaseLayer( this, 'base', {
      color: '#f7f7f7',
      cloud_color: 'rgba(255,255,255,0.5)',
      cloud_stroke: 'rgba(255,255,255,0.7)',
      clouds: 4,
      min_size: 100,
      max_size: 200,
      speed: 4
    } );

    this.layers = {
      common: new App.Layer( this, 'common' ),
      debris: new App.Layer( this, 'debris' ),
      ui: new App.Layer( this, 'ui', {static: true} )
    };

    this.availablePowerups = [
      {name: 'rapidfire', options: {color: '#0f0'}},
      {name: 'half_speed', options: {color: '#123456'}}
    ];
  };

  App.Game.prototype.setup = function() {
    this.bullets = [];
    this.debris = [];
    this.powerups = [];
    this.activeKeys = [];
    this.activePowerups = {};
    this.direction = false;
    this.active = true;
    this.delta = new Date();

    if ( this.player ) {
      this.player.attributes.points = 0;
      this.player.attributes.damage = 0;
      this.player.attributes.hits = 0;
    }

    this.UI = new App.UI( this );
    this.addDebris();
    this.applyControls();
  };

  App.Game.prototype.applyControls = function() {
    var $doc = App.$(document),
      lookup = function( event ) {
        return jQuery.hotkeys.specialKeys[ event.which ] ||
          String.fromCharCode(event.which).toLowerCase();
      };

    $doc.on( 'keydown', _.bind(function( event ) {
      var key = lookup( event );

      this.activeKeys[key] = true;
    }, this ));

    $doc.on( 'keyup', _.bind(function( event ) {
      var key = lookup( event );

      this.activeKeys[key] = false;
    }, this ));
  };

  App.Game.prototype.addDebris = function( options ) {
    var i = 0;
    for ( i ; i < this.attributes.total_debris; i++ ) {
      var debris = new App.Debris( this, options );
      this.debris.push(debris);
    }
  };

  App.Game.prototype.addPlayer = function( options ) {
    this.player = new App.Player( this, options );
  };

  App.Game.prototype.start = function() {
    this.setup();
    this.loop();
    this.providePowerups();
  };

  App.Game.prototype.stop = function() {
    this.active = false;
    clearInterval( this.powerupManager );
  };

  App.Game.prototype.updateUI = function() {
    this.UI.update();
  };

  App.Game.prototype.providePowerups = function() {
    this.powerupManager = setInterval( _.bind( this.addPowerup, this ), this.attributes.powerup_delay );
  };

  App.Game.prototype.addPowerup = function() {
    var selected = this.choosePowerup();
      powerup = new App.Powerup( this, selected.name, selected.options );

    this.powerups.push( powerup );
  };

  App.Game.prototype.choosePowerup = function() {
    var total = this.availablePowerups.length,
      index = ( Math.random() * total ) << 0;

    return this.availablePowerups[ index ] || false;
  };

  App.Game.prototype.clearPowerup = function( name, duration ) {
    clearInterval( this.powerupManager );
    setTimeout( _.bind( function() {
      delete this.activePowerups[ name ];
      this.providePowerups();
    }, this ), duration );
  };

  App.Game.prototype.loop = function() {
    var frame,
      date = new Date(),
      delta = (date - this.delta) / 60;

    this.delta = date;

    this.clearLayers();
    this.layer.animate( delta );

    // Handle direction controls
    if ( this.activeKeys.left ) {
      this.player.left( delta );
    } else if ( this.activeKeys.right ) {
      this.player.right( delta );
    }

    // Handle bullets
    if ( this.activeKeys.space || this.activeKeys.up ) {
      this.player.fire();
    }

    // Draw player to the canvas
    this.player.draw();

    // Draw all bullets to the canvas
    _.each( this.bullets, function( bullet ) {
      bullet.move( delta ).draw();
    } );

    // Draw all debris to the canvas
    _.each( this.debris, function( debris ) {
      debris.move( delta ).draw();
    } );

    _.each( this.powerups, function( powerup ) {
      powerup.move( delta ).draw();
    } );

    this.detectCollisions();

    this.updateUI();

    // Ask browser to detect next frame and recurse
    // or fallback to setTimeout.
    // requestAnimFrame() helper will return false when game is stopped.
    if( this.active ) {
      try {
        frame = App.Helpers.requestAnimFrame();
        frame( _.bind(this.loop, this) );
      } catch( e ) {
        throw e;
      }
    }
  };

  App.Game.prototype.clearLayers = function() {
    _.each( this.layers, function( layer ) {
       layer.clear();
    }, this );
  };

  // Clean bullets out of array that are
  // out of range or destoryed
  App.Game.prototype.cleanBullet = function( index ) {
    this.bullets.splice( index, 1 );
  };

  App.Game.prototype.cleanPowerup = function( index ) {
    this.powerups.splice( index, 1 );
  };

  App.Game.prototype.detectCollisions = function() {

    _.each( this.debris, function( debris ) {
      _.each( this.bullets, function( bullet ) {
        if( App.Helpers.collision( bullet, debris ) ) {
          bullet.destroy();
          debris.destroy();
          this.player.confirmKill( debris );
        }
      }, this );


      if( App.Helpers.collision( debris, this.player ) ) {
        this.player.hit();
        debris.destroy();
      }
    }, this );

    _.each( this.powerups, function( powerup, index ) {
      _.each( this.bullets, function( bullet ) {
        if ( App.Helpers.collision( powerup, bullet ) ) {
          powerup.hit();
          bullet.destroy();
        }
      }, this );

      if ( (powerup.attributes.x - powerup.attributes.width) > this.attributes.width || !powerup.active ) {
        this.cleanPowerup( index )
      }
    }, this );

    _.each( this.bullet, function( bullet, index ) {
      if( (bullet.attributes.y + bullet.attributes.height) < 0 || !bullet.active ) {
        this.cleanBullet( index );
      }
    }, this );

  };

}());
