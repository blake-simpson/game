(function (){
  App.Layer = function( owner, name, attributes ) {
    if( !attributes || typeof attributes === undefined ) {
      attributes = {};
    }

    var defaults = {
      color: false
    };

    this.attributes = _.defaults( attributes, defaults );

    this.__super = owner;
    this.name = name;

    this.canvas = App.$( '<canvas>' );
    this.canvas.attr( 'id', this.name );
    this.canvas[0].width = this.__super.attributes.width;
    this.canvas[0].height = this.__super.attributes.height;

    // Access context from raw dom object
    this.ctx = this.canvas[0].getContext( '2d' );

    if( this.attributes.color ) {
      this.fill();
    }

    App.$( this.__super.container ).append(this.canvas);
    return this;
  };

  App.Layer.prototype.fill = function() {
    this.ctx.fillStyle = this.attributes.color;
    this.ctx.beginPath();
    this.ctx.rect( 0, 0, this.__super.attributes.width, this.__super.attributes.height );
    this.ctx.closePath();
    this.ctx.fill();
  };

  App.Layer.prototype.clear = function() {
    if( !this.attributes.color ) {
      this.ctx.clearRect( 0, 0, this.__super.attributes.width, this.__super.attributes.width );
    }

  };
}() );
