var TradierStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  var strategy = new TradierStrategy({
    clientID: 'LITTLEKICKS',
    clientSecret: 'PEACHSCHNAPPS'
  },
  function() {});

  describe('loading profile', function() {
    var profile;

    before(function(done) {
      strategy._oauth2._request = function(method, url, headers, post_body, access_token, callback) {
        var body = '{"profile":{"id":"id-seinfeld","account":{"account_number":"8675309","day_trader":"false","option_level":"3","status":"Approved","type":"margin","last_update_date":"2013-11-01T04:08:29.354Z"},"name":"Jerry Seinfeld"}}';
        callback(null, body, undefined);
      }

      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('tradier');
      expect(profile.id).to.equal('id-seinfeld');
      expect(profile.name).to.equal('Jerry Seinfeld');
      expect(profile.accounts).to.have.length(1);
      expect(profile.accounts[0].account_number).to.equal('8675309')
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

describe('encountering an error', function() {
  var err, profile;

  before(function(done) {
    strategy._oauth2._request = function(method, url, headers, post_body, access_token, callback) {
      var body = '{"profile":{"id":"id-seinfeld","account":{"account_number":"8675309","day_trader":"false","option_level":"3","status":"Approved","type":"margin","last_update_date":"2013-11-01T04:08:29.354Z"},"name":"Jerry Seinfeld"}}';
      callback('error', body, undefined);
    }

    strategy.userProfile('wrong-token', function(e, p) {
      err = e;
      profile = p;
      done();
    });
  });

  it('should error', function() {
    expect(err).to.be.an.instanceOf(Error);
    expect(err.constructor.name).to.equal('InternalOAuthError');
    expect(err.message).to.equal('Failed to fetch user profile');
  });

  it('should not load profile', function() {
    expect(profile).to.be.undefined;
  });
});

});
