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
  profile.full_name = json.full_name;
  profile.firts_name = json.firts_name;
  profile.last_name = json.last_name;
  profile.created_at = json.created_at;
  profile.email = json.email;

  // TODO: Implement profile image in the API
  // if (json.picture) {

  // }

  return profile;
};
