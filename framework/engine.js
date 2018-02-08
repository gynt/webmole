const fs = require('fs');

module.exports.Player = require('./Player')
module.exports.Item = require('./Item')
module.exports.Exam = require('./Exam')
module.exports.Round = require('./Round')
module.exports.Game = require('./Game')

module.exports.loadGame = function(filename) {
    return JSON.parse(fs.readFileSync(filename));
}

module.exports.saveGame = function(game, filename) {
    fs.writeFile(filename, JSON.stringify(game), (err) => {
        if(err) throw err;
    })
}