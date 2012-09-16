(function() {
  App.PowerupManager = function( owner, attributes ) {
    attributes = App.Helpers.verifyAttributes( attributes );

    this.__super = owner;

    this.availablePowerups = [
      new App.Powerup( this, 'rapidfire', {color: '#0f0'} ),
      new App.Powerup( this, 'half_speed', {color: '#123456', duration: 8000} ),
    ];

    this.active = {};
    this.delay = this.__super.attributes.powerup_delay;
    this.clock = false;

    this.providePowerups();
  };

  App.PowerupManager.prototype.providePowerups = function() {
    this.stop();
    this.clock = setTimeout( _.bind( this.add, this ), this.delay );
  };

  App.PowerupManager.prototype.add = function() {
    var powerup = this.choose().reset();

    this.__super.powerups.push( powerup );
    this.providePowerups();
  };

  App.PowerupManager.prototype.stop = function() {
    clearTimeout( this.clock );
  };

  App.PowerupManager.prototype.choose = function() {
    var total = this.availablePowerups.length,
      index = ( Math.random() * total ) << 0;

    return this.availablePowerups[ index ];
  };

  App.PowerupManager.prototype.isActive = function( name ) {
    return this.active[ name ] ? true : false;
  };

  App.PowerupManager.prototype.activate = function( powerup ) {
    this.active[ powerup.name ] = true;
    this.clear( powerup.name, powerup.attributes.duration );
  };

  App.PowerupManager.prototype.clear = function( name, duration ) {
    this.stop();
    this.clock = setTimeout( _.bind( function() {
      delete this.active[ name ];
      this.providePowerups();
    }, this ), duration );
  };

}() );
