# passport-tradier
[![Build](https://travis-ci.org/tradier/passport-tradier.png)](http://travis-ci.org/tradier/passport-tradier)
[![Coverage Status](https://coveralls.io/repos/tradier/passport-tradier/badge.png)](https://coveralls.io/r/tradier/passport-tradier)
[![Dependencies](https://david-dm.org/tradier/passport-tradier.png)](http://david-dm.org/tradier/passport-tradier)

[Passport](http://passportjs.org/) strategy for authenticating with [Tradier](https://developer.tradier.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Tradier in your Node.js applications.
By plugging into Passport, Tradier authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-tradier

## Usage

#### Configure Strategy

The Tradier authentication strategy authenticates users using a Tradier
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a app ID, app secret, and callback URL.

    passport.use(new TradierStrategy({
        clientID: TRADIER_APP_ID,
        clientSecret: TRADIER_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/tradier/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ tradierId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tradier'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/tradier',
      passport.authenticate('tradier'));

    app.get('/auth/tradier/callback',
      passport.authenticate('tradier', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Tests

    $ npm install
    $ npm test

## Credits
  - Heavily influenced by passport-facebook
  - Passport: [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Tradier Inc. <[https://tradier.com](https://tradier.com/)>
