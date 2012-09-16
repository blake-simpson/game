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

  App.UI.prototype.drawPowerups = function() {
    var manager = this.__super.PowerupManager
      size = this.attributes.height - 10,
      originalOffset = ( this.__super.attributes.width / 2 - ( size / 2) ) << 0,
      i = 1;


    _.each( manager.active, function( val, name ) {
      var powerup = _.find( manager.availablePowerups, function( p ) { return p.name == name; } ),
        offset = originalOffset + ( size * i );

      //console.log( originalOffset, offset );

      this.layer.ctx.beginPath();
      this.layer.ctx.fillStyle = powerup.attributes.color;
      this.layer.ctx.rect( offset, 5, size, size );
      this.layer.ctx.fill();
      this.layer.ctx.closePath();
      i++;
    }, this );
  };

  App.UI.prototype.update = function() {
    this.drawBar();
    this.drawPoints();
    this.drawHits();
    this.drawPowerups();
  };
}() );
