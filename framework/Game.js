const Round = require('./Round');

function Game() {
  this.rounds=new Array(new Round());
  this.players=new Array();
  this.current_round=undefined;
}

Game.prototype.pickMole = function() {
  this.rounds[0].players.forEach(function(el, i){
    el.is_mole=false;
  });
  this.rounds[0].players[getRandomInt(this.rounds[0].players.length)].is_mole=true;
}

Game.prototype.hasMole = function() {
  return this.rounds[0].players.filter(function(el,i){
    return el.is_mole==true;
  }).length > 0;
}

Game.prototype.lookupPlayer = function(id) {
  return this.players.filter((el) => el.id==id)[0];
}

module.exports = Game;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
