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

var engine = require("./framework/engine");

var game_handling = require('./network/games');
var game_handler = new game_handling.Handler(express.Router());
game_handler.game = new engine.Game();
game_handler.getEngine = function() {
	return engine;
}
app.use("/game", game_handler.router);

var authentication = require('./network/authentication');
var authenticator = new authentication.Handler(express.Router());
authenticator.getUsers = function() {
	return game_handler.getGame().players;
}
fs.readFile("admin.json", function(err, data){
	if(err){authenticator.admin={username:"admin",password:"admin"};return;};
	authenticator.admin=JSON.parse(data);
});
app.use("/session", authenticator.router);

app.get('/', function(req, res) { 
	//console.log("cu" + res.session.username);
	if(req.session.logged_in && req.session.logged_in===true) {
		if(req.session.is_admin) {
			res.render('home', {user: authenticator.admin.username, admin: true});
		} else {
			res.render('home', {user: req.session.player, admin: false});
		}
	} else {
		res.render('home', {user: undefined, admin: false});
	}
})

app.get('/content', function(req, res) {

})

var examination = require('./network/examination');
var examinator = new examination.Handler(express.Router(), game_handler.getGame);
app.use("/exam", examinator.router);

var settings = {};
fs.readFile("settings.json", function(err, data) {
	if(err) {settings = {}; return;};
	settings=JSON.parse(data);
});

app.listen(3000, () => console.log('Webmole app listening on port 3000!'));
