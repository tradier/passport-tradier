var TradierStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
  describe('handling malformed responses', function() {
    var strategy =  new TradierStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});


    var err, profile;
    before(function(done) {
      strategy._oauth2._request = function(method, url, headers, post_body, access_token, callback) {
        var body = 'No soup for you.';
        callback(null, body, undefined);
      }

      strategy.userProfile('token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
  });

});
