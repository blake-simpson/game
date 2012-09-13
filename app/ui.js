(function() {
  App.UI = function( owner ) {
    this.__super = owner;
    this.layer = this.__super.layers.ui;

    this.attributes = {
      color: 'rgba(255,255,255,0.7)',
      text_color: '#555',
      font: 'bold 14px Arial',
      //color: '#fff',
      height: 40
    };
  };

  App.UI.prototype.drawBar = function() {
    this.layer.ctx.fillStyle = this.attributes.color;
    this.layer.ctx.beginPath();
    this.layer.ctx.rect( 0, 0, this.__super.attributes.width, this.attributes.height );
    this.layer.ctx.closePath();
    this.layer.ctx.fill();
  };

  App.UI.prototype.drawPoints = function() {
    var text = 'Points: ' + this.__super.player.attributes.points;

    this.layer.ctx.fillStyle = this.attributes.text_color;
    this.layer.ctx.font = this.attributes.font;
    this.layer.ctx.fillText(text, 10, 24);
    return this;
  };

  App.UI.prototype.drawHits = function() {
    var text = 'Damage: ' + this.__super.player.attributes.damage + '%';

    this.layer.ctx.fillStyle = this.attributes.text_color;
    this.layer.ctx.font = this.attributes.font;
    this.layer.ctx.fillText(text, (this.__super.attributes.width - 110), 24);
    return this;
  };

  App.UI.prototype.update = function() {
    this.drawBar();
    this.drawPoints();
    this.drawHits();
  };
}() );
