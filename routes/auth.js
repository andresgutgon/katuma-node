var express = require('express')
var debug = require('debug')('http');
var router = express.Router();
var Oauth2 = require('simple-oauth2');
var oauth2;
var CLIENT_ID;
var CLIENT_SECRET;
var authorization_uri;

CLIENT_ID = '7ff06b00f5de3bdadaeaa8ebe66f14f0d913427887b2684d578a84497392b6ad';
CLIENT_SECRET = '787b825e435eba3895321bdb6a81a4dd155f4d6eaa5a68ee9cadd5aed3560393';

oauth2 = Oauth2({
  clientID: CLIENT_ID
, clientSecret: CLIENT_SECRET
, site: 'http://localhost:3000'
, authorizationPath: '/oauth/authorize'
, tokenPath: '/oauth/token'
, revocationPath: '/oauth/revoke'
});

// Authorization uri definition
authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:8000/auth/callback'
, scope: 'public'
});

router.get('/', function (req, res) {
  res.redirect(authorization_uri);
});

router.get('/callback', function (req, res) {
  var token = 'foooo';

  var code = req.query.code;
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:8000/auth/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    if (!!result) {
      token = oauth2.accessToken.create(result);
    }
    res.render('oauth-callback', { token: token});
  }
});

router.get('/logout', function (req, res) {
  oauth2.accessToken.revoke('access_token', afteRevokeToken);
  function afteRevokeToken(error, result) {
    if (error) { console.log('Error revoking token', error.message); }
    res.redirect('/');
  }
});

module.exports = router;
