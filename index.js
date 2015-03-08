var express = require('express')
  , passport = require('passport')
  , path = require('path')
  , util = require('util')
  , KatumaOAuth2Strategy = require('./lib/passport-katuma').Strategy
  , logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  console.log('user ', user)
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new KatumaOAuth2Strategy({
    clientID: process.env.CLIENT_ID
  , clientSecret: process.env.CLIENT_SECRET
  , authorizationURL: process.env.OAUTH_SERVER_URL + '/oauth/authorize'
  , profileURL:  process.env.OAUTH_SERVER_URL + '/api/v1/me'
  , tokenURL: process.env.OAUTH_SERVER_URL + '/oauth/token'
  , callbackURL: process.env.CLIENT_URL + '/auth/callback'
  }
, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('combined'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({
  secret: process.env.SECRET_SESSION
, resave: true
, saveUninitialized: false
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.redirect('/auth/katuma');
  }
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/katuma', passport.authenticate('katuma'));

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/callback',
  passport.authenticate('katuma', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// app.listen(8000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Listen for incoming requests and serve them.
app.listen(process.env.PORT);
