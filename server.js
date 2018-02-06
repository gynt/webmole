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

app.get('/players/view', function(req, res) {
	if(req.session.is_admin) {
		res.send({data:game.players});
	}
})

app.post('/players/edit', function(req, res) {
	if(req.session.is_admin) {
		game.players=req.body;
		res.send({status:"ok",message:"edited",code:9});
	}
})

app.get('/:round/:part/view', function(req, res) {
	if(req.session.is_admin) {
		res.send({data:game.rounds[req.params.round][req.params.part]});
	}
})

app.post('/:round/:part/edit', function(req, res) {
	if(req.session.is_admin) {
		game.rounds[req.params.round][req.params.part]=req.body;
		res.send({status:"ok",message:"edited",code:9});
	}
})

app.get('/', function(req, res) { 
	if(req.session.logged_in and req.session.logged_in===true) {
		if(req.session.is_admin) {
			res.render('admin', {session: req.session});
		} else {
			res.render('player', {session: req.session});
		}
	} else {
		res.render('login', { title: 'webmole', message: 'Please log in!' });
	}
})

app.post('/login', function(req, res) {
	if(req.username==admin.username && req.password==admin.password) {
		req.session.logged_in=true;
		req.session.is_admin=true;
		res.send({status:"welcome",message:"welcome admin!", code:5});
	} else {
		var candidates = game.players.filter((el) => el.name==req.username);
		if(candidates.length!=1) {
			res.send({status:"error",message:"incorrect username",code:3});
		} else {
			if(candidates[0].password != req.body.password) {
				res.send({status:"error", message:"incorrect password",code:4});
			} else {
				req.session.logged_in=true;
				req.session.is_admin=false;
				res.send({status:"welcome",message:"welcome player!",code:6});
			}
		}
	}
})

app.post('/logout', function(req, res) {
	req.session.destroy();
	res.send({status:"goodbye",message:"logged out!",code:7});
})

app.post('/next', function(req, res) {
	if(req.session.logged_in and req.session.logged_in===true) {
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

var Game = require("./framework/Game");
var game = new Game();

var admin = {username:"admin",password:"admin"};
fs.readFile("admin.json", function(err, data){
	if(err) throw err;
	admin=JSON.parse(data);
});

var settings = {};
fs.readFile("settings.json", function(err, data) {
	if(err) throw err;
	settings=JSON.parse(data);
});

app.listen(3000, () => console.log('Webmole app listening on port 3000!'));
