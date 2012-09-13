(function (){
  App.Bullet = function( owner, attributes ) {
    if ( !attributes || attributes === undefined ) {
      attributes = {};
    }

    this.__super = owner;
    this.__game = this.__super.__super;
    this.layer = this.__game.layers.bullets;

    this.active = true;

    var defaults = {
      x: 0,
      y: 0,
      width: 4,
      height: 8,
      speed: 10,
      color: '#00f'
    };

    this.attributes = _.defaults( attributes, defaults );

    // Set default bullet position relative to parent player
    this.attributes.x = Math.round( this.__super.attributes.x + (this.__super.attributes.width / 2) );
    this.attributes.y = this.__super.attributes.y;
  };

  App.Bullet.prototype.destroy = function() {
    this.active = false;
  };

  App.Bullet.prototype.move = function() {
    this.attributes.y -= this.attributes.speed;
    return this;
  };

  App.Bullet.prototype.draw = function() {
    if( !this.active ) { return false; }

    var attrs = this.attributes;

    this.layer.ctx.fillStyle = attrs.color;
    this.layer.ctx.fillRect( attrs.x, attrs.y, attrs.width, attrs.height );
  };
}());
