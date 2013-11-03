/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = json.profile.id;
  profile.name = json.profile.name;

  if(Array.isArray(json.profile.account)) {
    profile.accounts = json.profile.account;
  } else {
    profile.accounts = [json.profile.account];
  }

  return profile;
};
