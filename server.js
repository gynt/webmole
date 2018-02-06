const express = require('express')
const app = express()
const session = require('express-session')
const pug = require('pug');

app.set('views', './views')
app.set('view engine','pug')


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


app.get('/', function(req, res) { 
	if(req.session.logged_in) {
		
	} else {
		res.render('login', { title: 'Hey', message: 'Hello there!' });
	}
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))