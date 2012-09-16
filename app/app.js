$(function(){
  var game = new App.Game({
    canvas_container_id: 'game'
  }),
  $stop = $('#stop');


  var stop = function() {
      game.stop();
      $stop.click(start);
      $stop.text('Restart');
    }

  var start = function() {
      game.start();
      $stop.click(stop);
      $stop.text('Stop Game');
    }

  window.game = game;

  game.addPlayer({
    name: 'Blake'
  });

  start();

  console.log('game', game);
});
