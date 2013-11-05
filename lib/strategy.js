/**
 * Module dependencies.
 */
var parse = require('./profile').parse
var util = require('util')
var OAuth2Strategy = require('passport-oauth2')
var InternalOAuthError = require('passport-oauth2').InternalOAuthError


/**
 * `Strategy` constructor.
 *
 * The Tradier authentication strategy authenticates requests by delegating to
 * Tradier using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Tradier application's App ID
 *   - `clientSecret`  your Tradier application's App Secret
 *   - `callbackURL`   URL to which Tradier will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new TradierStrategy({
 *         clientID: 'kosmo',
 *         clientSecret: 'thevault'
 *         callbackURL: 'https://www.example.net/auth/tradier/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.tradier.com/v1/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.tradier.com/v1/oauth/accesstoken';
  options.scopeSeparator = options.scopeSeparator || ',';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'tradier';
  this._profileURL = options.profileURL || 'https://api.tradier.com/v1/user/profile';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to Tradier using OAuth 2.0.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  if (req.query && req.query.error) {
    return this.fail(new Error('Authorization Error'));
  }

  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from Tradier.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `tradier`
 *   - `id`               the user's Tradier ID
 *   - `name`             the Tradier user's full name
 *   - `accounts`         an array of account objects
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = this._profileURL;
  var headers = {
    'Authorization': this._oauth2.buildAuthHeader(accessToken),
    'Accept': 'application/json'
  }

  this._oauth2._request("GET", url, headers, "", accessToken, function (err, body, res) {
    var json;

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);

    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = parse(json);
    profile.provider = 'tradier';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
