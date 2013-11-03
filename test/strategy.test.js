var chai = require('chai')
var TradierStrategy = require('../lib/strategy');


describe('Strategy', function() {
  var strategy = new TradierStrategy({
      clientID: 'LITTLEKICKS',
      clientSecret: 'PEACHSCHNAPPS'
    },
    function() {});

  it('should be named tradier', function() {
    expect(strategy.name).to.equal('tradier');
  });

  describe('handling a return request in which authorization was denied by user', function() {
    var info;

    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          console.log(i)
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.error = 'access_denied';
          req.query.state = '1234'
          done();
        })
        .authenticate();
    });

    it('should fail with info', function() {
      expect(info).to.not.be.undefined;
      expect(info.message).to.equal('Authorization Error');
    });
  });

});
