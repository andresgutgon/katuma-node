/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' === typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = json.id;
  profile.name = json.name;
  if (json.email) {
    profile.email = json.email;
  }

  // TODO: Implement profile image in the API
  // if (json.picture) {

  // }

  return profile;
};
