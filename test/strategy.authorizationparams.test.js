var chai = require('chai')
var TradierStrategy = require('../lib/strategy');


describe('Strategy', function() {

  var strategy = new TradierStrategy({
      clientID: 'LITTLEKICKS',
      clientSecret: 'PEACHSCHNAPPS'
    },
    function() {});

  describe('handling a request to be redirected', function() {
    var url;

    before(function(done) {
      chai.passport(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
        })
        .authenticate();
    });

    it('should be redirected', function() {
      expect(url).to.equal('https://api.tradier.com/v1/oauth/authorize?response_type=code&redirect_uri=&client_id=LITTLEKICKS&type=web_server');
    });
  });
});
