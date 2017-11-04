const db = require('../models');

module.exports = {
  newUser(profile) {
    return db.User
      .upsert({ facebook_id: profile.facebook_id, facebook: profile });
  },

  getCrewMembers(req, res) {
    let crew_id = rew.query.crew_id;
    return db.User
      .findAll({ include: [{ model: db.User_Crew, where: { crew_id: crew_id, role: 'member' } }] })
      .then(users => res.status(200).send(users))
      .catch(err => res.status(401).send(err));
  },
};