var Exam = require('./Exam')

function Round() {
  this.player_ids=new Array();
  this.exam=new Exam();
}

module.exports = Round;