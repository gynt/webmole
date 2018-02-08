const express = require('express')
const app = express()
const session = require('express-session')
const pug = require('pug');
const body_parser = require('body-parser');
const fs = require('fs');

app.set('views', './views')
app.set('view engine','pug')

app.use(body_parser.json());

app.use(express.static("public"));

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
	cookie: { secure: false }
/*     store: new MongoStore({
        url: 'mongodb://localhost/test-app',
        touchAfter: 24 * 3600 // time period in seconds
    }) */
  
}))

var authentication = require('./network/authentication');
var authenticator = new authentication.Handler(express.Router());
authenticator.onGetUsers = function() {
	return game.players;//var candidates = game.players.filter((el) => el.name==req.body.username);
}
fs.readFile("admin.json", function(err, data){
	if(err){authenticator.admin={username:"admin",password:"admin"};return;};
	authenticator.admin=JSON.parse(data);
});
app.use("/session", authenticator.router);

var game_handling = require('./network/game_handling');
var game_handler = new game_handling.Handler(express.Router());
game_handler.getGame = function() {
	return game;
}
game_handler.getEngine = function() {
	return engine;
}
game_handler.setGame = function(g) {
	game=g;
}
app.use("/game", game_handler.router);

app.get('/', function(req, res) { 
	if(req.session.logged_in && req.session.logged_in===true) {
		if(req.session.is_admin) {
			res.render('admin', {session: req.session});
		} else {
			res.render('player', {session: req.session});
		}
	} else {
		res.render('login', { title: 'webmole', message: 'Please log in!' });
	}
})

app.get('/dashboard', function(req, res) {
	if(req.session.is_admin===true) {
		res.render('dashboard', {});
	} else {
		res.render('unauthorized', {});
	}
})

app.post('/next', function(req, res) {
	if(req.session.logged_in===true) {
		if(game.current_round===undefined) {
			res.render('no-exam');
			return;
		}
		if(req.session.page===undefined) {
			req.session.page=0;
			game.current_round.exam.results[req.session.player] = [];
			game.current_round.exam.timings[req.session.player] = [Date.now()];
			res.send({status:"begin",code:2, message:"good luck!"});
			return;
 		} 
		game.current_round.exam.results[req.session.player].append(req.body);
		req.session.page+=1;
		if(req.session.page >= game.current_round.exam.items.length) {
			res.render('exam-finished', {});
		} else {
			res.render('items/'+game.current_round.exam[req.session.page].type.toString(), game.current_round.exam[req.session.page]);
		}
	} else {
		res.send({status:"error", message:"not logged in", code:1});
	}
})

var engine = require("./framework/engine");
var game = new engine.Game();

var settings = {};
fs.readFile("settings.json", function(err, data) {
	if(err) {settings = {}; return;};
	settings=JSON.parse(data);
});

app.listen(3000, () => console.log('Webmole app listening on port 3000!'));
