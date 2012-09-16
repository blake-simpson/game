(function() {

  App.Powerup = function( owner, name, attributes ) {
    attributes = App.Helpers.verifyAttributes( attributes );

    this.__super = owner;
    this.__game = this.__super.__super;

    this.name = name;
    this.layer = this.__game.layers.common;

    var defaults = {
      human_name: this.name,
      color: '#0f0',
      width: 20,
      height: 20,
      speed: 5,
      duration: 5000,
      x: 0,
      y: 0
    };

    this.attributes = _.defaults( attributes, defaults );

    this.reset();
  };

  App.Powerup.prototype = new App.CanvasObject();

  App.Powerup.prototype.hit = function() {
    this.__super.activate( this );
    this.destroy();
  };

  App.Powerup.prototype.destroy = function() {
    this.active = false;
  };

  App.Powerup.prototype.move = function() {
    this.attributes.x += this.attributes.speed;
    return this;
  };

  App.Powerup.prototype.reset = function () {
    this.active = true;
    this.attributes.x = -this.attributes.width;
    // Randomly along the height of the game minus twice the height of thr player
    // r = gh - (2ph)
    this.attributes.y = ( Math.random() * ( this.__game.attributes.height - (this.__game.player.attributes.height * 2) ) ) << 0;
    return this;
  };

}() );
