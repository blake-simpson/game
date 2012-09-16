(function (){

  App.Player = function( owner, attributes ) {
    if ( !attributes || attributes === undefined) {
      attributes = {};
    }

    this.__super = owner;
    this.layer = this.__super.layers.common;

    this.active = true;

    // Define custom Player properties
    var defaults = {
      name: 'Unknown player',
      points: 0,
      width: 20,
      height: 30,
      speed: 6,
      color: '#0066cc'
    };

    this.attributes = _.defaults( attributes, defaults );


    // player positioned at bottom of canvas
    this.attributes.y = this.__super.attributes.height - this.attributes.height;
    this.attributes.x = ( this.__super.attributes.width / 2 ) - ( this.attributes.width / 2 ) << 0;

    // Predefined attributes
    this.attributes.points = 0;
    this.attributes.hits = 0;
    this.attributes.damage = 0;
  };

  App.Player.prototype = new App.CanvasObject();

  App.Player.prototype.confirmKill = function( debris ) {
    // Points = max size of debry minus it's size times by point multiplyer.
    // The smaller the debry, the higher the points.
    // example:
    // max_size (10) - size (3) = 7  * multiplier (10) = 70
    // max_size (10) - size (8) = 2  * multiplier (10) = 20
    var calculated = (debris.attributes.max_size - debris.attributes.width) * this.__super.attributes.point_multiplier;

    this.attributes.points += calculated;
  };

  App.Player.prototype.hit = function() {
    this.attributes.hits += 1;
    this.attributes.damage = this._calculateDamage();

    if( this.attributes.damage === 100 ) {
      this.__super.stop();
    }
  };

  App.Player.prototype.fire = function() {
    if (this.firing) { return false; }

    var bullet = new App.Bullet( this ),
      delay = this.__super.PowerupManager.isActive( 'rapidfire' ) ? 65 : 130;

    this.firing = true;
    this.__super.bullets.push( bullet );

    // Delay firing for a few miliseconds to stop bullet spam
    setTimeout( _.bind(this.fireComplete, this), delay );
  };

  App.Player.prototype.fireComplete = function() {
    this.firing = false;
  };

  App.Player.prototype.left = function() {
    var newPos = this.attributes.x - this.attributes.speed;
    this.updatePosition( newPos, this.attributes.y );
  };

  App.Player.prototype.right = function() {
    var newPos = this.attributes.x + this.attributes.speed;
    this.updatePosition( newPos, this.attributes.y );
  };

  App.Player.prototype.updatePosition = function( x, y ) {
    var width = this.attributes.width,
      height = this.attributes.height,
      speed = this.attributes.speed,
      game = this.__super.attributes;

    // Check the player is not hitting any edge.
    // we must include the speed because `x` and `y` are the new corodinates
    // and the actual corodinates will always be one space short of the canvas
    // edge when the edge is detected.
    if ( (x - speed)  < ( game.width - width ) && (x + speed) > 0 ) {
      this.attributes.x = x;
    }

    if ( (y - speed) < ( game.height - height ) && (y + speed) > 0 ) {
      this.attributes.y = y;
    }
  };

  App.Player.prototype._calculateDamage = function() {
    return this.attributes.hits * 20;
  };

}());
