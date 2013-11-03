var fs = require('fs')
var parse = require('../lib/profile').parse;


describe('profile.parse', function() {
  var profile;

  describe('single account', function() {
    before(function(done) {
      fs.readFile('test/data/profile.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('sets the user\'s name', function() {
      expect(profile.name).to.equal('Jerry Seinfeld');
    });

    it('sets the user\'s ID', function() {
      expect(profile.id).to.equal('id-seinfeld');
    });

    it('sets an accounts length of 1', function() {
      expect(profile.accounts).to.have.length(1);
    })

    it('set an account', function() {
      expect(profile.accounts[0].account_number).to.equal('8675309');
    })

  })

  describe('multiple accounts', function() {
    before(function(done) {
      fs.readFile('test/data/profile-multiple.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('sets the user\'s name', function() {
      expect(profile.name).to.equal('Jerry Seinfeld');
    });

    it('sets the user\'s ID', function() {
      expect(profile.id).to.equal('id-seinfeld');
    });

    it('sets an accounts length of 1', function() {
      expect(profile.accounts).to.have.length(2);
    })

    it('set an account', function() {
      expect(profile.accounts[0].account_number).to.equal('8675309');
      expect(profile.accounts[1].account_number).to.equal('8675310');
    })
  })
});
