(function() {
  App.Powerup = function( owner, name, attributes ) {
    attributes = App.Helpers.verifyAttributes( attributes );

    this.__super = owner;
    this.__game = this.__super.__super;

    this.name = name;
    this.active = true;
    this.layer = this.__game.layers.common;

    var defaults = {
      color: '#00f',
      width: 20,
      height: 20,
      speed: 5,
      duration: 5000,
      x: 0,
      y: 0
    };

    this.attributes = _.defaults( attributes, defaults );

    this._calculateStartPosition();
  };

  App.Powerup.prototype = new App.CanvasObject();

  App.Powerup.prototype.hit = function() {
    this.__super.activate( this );
    this.destroy();
  };

  App.Powerup.prototype.destroy = function() {
    this.active = false;
  };

  App.Powerup.prototype.move = function( delta ) {
    this.attributes.x += ( this.attributes.speed + delta );
    return this;
  };

  App.Powerup.prototype._calculateStartPosition = function () {
    this.attributes.x = ( 0 - this.attributes.width );
    this.attributes.y = ( Math.random() * this.__game.attributes.height ) << 0;
  };

}() );
