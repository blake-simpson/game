(function (){
  App.Debris = function( owner, attributes ) {
    if ( !attributes || attributes === undefined ) {
      attributes = {};
    }

    this.__super = owner;
    this.layer = this.__super.layers.debris;

    var defaults = {
      speed: 4,
      min_size: 8,
      size: 10,
      color: '#cc3366'
    };

    this.attributes = _.defaults( attributes, defaults );

    this.attributes.max_size = this.attributes.min_size + this.attributes.size;

    this.generateAttributes();
  };

  App.Debris.prototype = new App.CanvasObject();

  App.Debris.prototype.generateAttributes = function() {
    this.attributes.x = ( Math.random() * this.__super.attributes.width ) << 0;
    this.attributes.y = this._calculateTopOffset();
    this._calculateSize();
    this.active = true;
    return this;
  };

  App.Debris.prototype.destroy = function() {
    this.active = false;
    this.generateAttributes();
  };

  App.Debris.prototype.move = function( delta ) {
    if ( this.attributes.y > this.__super.attributes.height ) {
      this.attributes.y = this._calculateTopOffset();
    } else {
      this.attributes.y += (this.attributes.speed + delta);
    }

    return this;
  };

  App.Debris.prototype._calculateTopOffset = function() {
    return -( Math.random() * this.__super.attributes.height ) << 0;
  };

  App.Debris.prototype._calculateSize = function() {
    var size = Math.round( Math.random() * this.attributes.size );

    size += this.attributes.min_size;

    this.attributes.height = size;
    this.attributes.width = size;
    return this;
  };
}() );
