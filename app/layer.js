(function (){

  //
  // @ Class: Layer
  //

  App.Layer = function( owner, name, attributes ) {
    if( !attributes || typeof attributes === undefined ) {
      attributes = {};
    }

    this.attributes = _.defaults( attributes, this.defaults );

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

    if( this.name == 'base' ) {
      this.createClouds();
    }

    return this;
  };

  App.Layer.prototype.defaults = {
    color: false
  };

  App.Layer.prototype.fill = function() {
    this.ctx.fillStyle = this.attributes.color;
    this.ctx.beginPath();
    this.ctx.rect( 0, 0, this.__super.attributes.width, this.__super.attributes.height );
    this.ctx.closePath();
    this.ctx.fill();
  };

  App.Layer.prototype.clear = function() {
    if( !this.attributes.static ) {
      this.ctx.clearRect( 0, 0, this.__super.attributes.width, this.__super.attributes.width );
    }
  };

  //
  // @ Class: Base Cloud
  //

  App.BaseCloud = function( owner ) {
    this.__super = owner;
    this.__game = this.__super.__super;

    this.attributes = {
      x: 0,
      y: 0,
      size: 10
    };

    // Choose colour
    this.attributes.color = this.__super.attributes.cloud_color;
    this.attributes.stroke = this.__super.attributes.cloud_stroke;

    this.generateAttributes();
    return this;
  };

  App.BaseCloud.prototype.angle = 2 * Math.PI;

  App.BaseCloud.prototype.generateAttributes = function() {
    // Choose a cloud size
    this.attributes.size = App.Helpers.random( this.__super.attributes.min_size, this.__super.attributes.max_size );

    // Choose a random start point
    this.attributes.x = ( Math.random() * this.__game.attributes.width ) << 0;
    this.attributes.y = ( -( Math.random() * this.__game.attributes.height ) - this.attributes.size ) << 0;
  };

  App.BaseCloud.prototype.move = function( delta ) {
    if( this.attributes.y > this.__game.attributes.height ) {
      this.generateAttributes();
    } else {
      this.attributes.y += (this.__super.attributes.speed + delta);
    }
    return this;
  };

  App.BaseCloud.prototype.draw = function() {
    var size = this.attributes.size,
      color = this.attributes.color,
      x = this.attributes.x,
      y = this.attributes.y;

    this.__super.ctx.beginPath();
    this.__super.ctx.arc( x, y, size, 0, this.angle, false );
    //this.__super.ctx.rect( x, y, size, size );
    this.__super.ctx.lineWidth = 2;
    this.__super.ctx.strokeStyle = this.attributes.stroke;
    this.__super.ctx.stroke();
    this.__super.ctx.fillStyle = color;
    this.__super.ctx.fill();
    this.__super.ctx.closePath();
  };

  //
  // @ Class: Base Layer
  //

  App.BaseLayer = App.Layer;

  App.BaseLayer.prototype.createClouds = function() {
    this.clouds = [];

    for( var i = 0; i < this.attributes.clouds; i++ ) {
      var cloud = new App.BaseCloud( this );

      this.clouds.push( cloud );
    }
  };

  App.BaseLayer.prototype.animate = function( delta ) {
    this.fill();

    _.each( this.clouds, function( cloud ){
      cloud.move( delta ).draw();
    }, this );
  };

}() );
