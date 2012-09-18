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
      powerup_delay: 8000
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

    this.applyControls();
  };

  App.Game.prototype.setup = function() {
    this.bullets = [];
    this.debris = [];
    this.powerups = [];
    this.activeKeys = [];
    this.direction = false;
    this.active = true;

    if ( this.player ) {
      this.player.attributes.points = 0;
      this.player.attributes.damage = 0;
      this.player.attributes.hits = 0;
    }

    this.UI = new App.UI( this );
    this.PowerupManager = new App.PowerupManager( this );

    this.addDebris();
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
  };

  App.Game.prototype.stop = function() {
    this.active = false;
    this.PowerupManager.stop();
  };

  App.Game.prototype.updateUI = function() {
    this.UI.update();
  };

  App.Game.prototype.loop = function() {
    var frame;

    this.clearLayers();

    this.detectCollisions();
    this.updateUI();

    // Haven't decided to have clouds or not. Looks good but performance hit.
    //this.layer.animate();

    // Draw all bullets to the canvas
    _.each( this.bullets, function( bullet, index ) {
      if( (bullet.attributes.y + bullet.attributes.height) < 0 || !bullet.active ) {
        this.cleanBullet( index );
      } else {
        bullet.draw().move();
      }
    }, this );

    this.handlePlayer();

    // Ask browser to detect next frame and recurse
    // or fallback to setTimeout.
    // requestAnimFrame() helper will return false when game is stopped.
    if( this.active ) {
      try {
        frame = App.Helpers.requestAnimFrame();
        frame( _.bind(this.loop, this) );
      } catch( e ) {}
    }
  };

  App.Game.prototype.handlePlayer = function() {
    // Handle direction controls
    if ( this.activeKeys.left ) {
      this.player.left();
    } else if ( this.activeKeys.right ) {
      this.player.right();
    }

    // Handle bullets
    if ( this.activeKeys.space || this.activeKeys.up ) {
      this.player.fire();
    }

    // Draw player to the canvas
    this.player.draw();
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
    this.debrisCollisions();
    this.powerupCollisions();
  };

  App.Game.prototype.debrisCollisions = function() {

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
      } else {
        debris.draw().move();
      }
    }, this );

  };

  App.Game.prototype.powerupCollisions = function() {

    _.each( this.powerups, function( powerup, index ) {
      _.each( this.bullets, function( bullet ) {
        if ( App.Helpers.collision( powerup, bullet ) ) {
          powerup.hit();
          bullet.destroy();
        }
      }, this );

      if ( (powerup.attributes.x - powerup.attributes.width) > this.attributes.width || !powerup.active ) {
        this.cleanPowerup( index );
      } else {
        powerup.draw().move();
      }
    }, this );

  };

}());
