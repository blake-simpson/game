(function() {
  App.CanvasObject = function() {}

  App.CanvasObject.prototype.draw = function() {
    if( !this.active ) { return this; }

    var attrs = this.attributes;

    this.layer.ctx.fillStyle = attrs.color;
    this.layer.ctx.fillRect( attrs.x, attrs.y, attrs.width, attrs.height );
    return this;
  };
}() );
