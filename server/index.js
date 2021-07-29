const express = require('express')
, session = require('express-session')  // https://github.com/expressjs/session
, bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, MemoryStore = require('memorystore')(session) // https://github.com/roccomuso/memorystore
, path = require('path')
, DsJwtAuth = require('../lib/DSJwtAuth')
, passport = require('passport')
, DocusignStrategy = require('passport-docusign')
, docOptions = require('../config/documentOptions.json')
, dsConfig = require('../config/index.js').config
, flash = require('express-flash')
, helmet = require('helmet') // https://expressjs.com/en/advanced/best-practice-security.html
, moment = require('moment')
, csrf = require('csurf') // https://www.npmjs.com/package/csurf
  , eg001 = require('./eg001EmbeddedSigning');

const PORT = process.env.PORT || 3001
  , HOST = process.env.HOST || 'localhost'
  , max_session_min = 180;
let hostUrl = 'http://' + HOST + ':' + PORT;

const app = express()
  .use(helmet())
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser())
  .use(session({
    secret: dsConfig.sessionSecret,
    name: 'ds-launcher-session',
    cookie: { maxAge: max_session_min * 60000 },
    saveUninitialized: true,
    resave: true,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(express.json())
  .use(((req, res, next) => {
    res.locals.user = req.user;
    res.locals.session = req.session;
    res.locals.hostUrl = hostUrl; // Used by DSAuthCodeGrant#logout
    next()
  }))
  .use((req, res, next) => {
    req.dsAuthJwt = new DsJwtAuth(req);
    req.dsAuth = req.dsAuthJwt;
    next();
  });

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// handle node api requests
app.get("/", (req, res) => {
  res.send('<h1> Backend homepage! </h1>');
})
app.get("/api/login", (req, res, next) => {
  req.dsAuthJwt.login(req, res, next);
});
app.post('/api/eg001', eg001.createController);
//app.get("/eg001", eg001.createController);
app.get("/ds_return", (req, res) => {
  let event = req.query && req.query.event,
    state = req.query && req.query.state,
    envelopeId = req.query && req.query.envelopeId;
  res.json({signResult: event})
});

// app.get("/api", (req, res) => {
//   res.json({ message: 'hello from server!' });
// });

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

passport.serializeUser(function (user, done) { done(null, user) });
passport.deserializeUser(function (obj, done) { done(null, obj) });
let scope = ["signature"];
let docusignStrategy = new DocusignStrategy({
  production: dsConfig.production,
  clientID: dsConfig.dsClientId,
  scope: scope.join(" "),
  clientSecret: dsConfig.dsClientSecret,
  callbackURL: hostUrl + '/ds/callback',
  state: true // automatic CSRF protection.
    // See https://github.com/jaredhanson/passport-oauth2/blob/master/lib/state/session.js
},
function _processDsResult(accessToken, refreshToken, params, profile, done) {
  // The params arg will be passed additional parameters of the grant.
  // See https://github.com/jaredhanson/passport-oauth2/pull/84
  //
  // Here we're just assigning the tokens to the account object
  // We store the data in DSAuthCodeGrant.getDefaultAccountInfo
  let user = profile;
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.expiresIn = params.expires_in;
  user.tokenExpirationTimestamp = moment().add(user.expiresIn, 's'); // The dateTime when the access token will expire
  return done(null, user);
}
);

/**
* The DocuSign OAuth default is to allow silent authentication.
* An additional OAuth query parameter is used to not allow silent authentication
*/
if (!dsConfig.allowSilentAuthentication) {
  // See https://stackoverflow.com/a/32877712/64904
  docusignStrategy.authorizationParams = function (options) {
    return { prompt: 'login' };
  }
}
passport.use(docusignStrategy);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});