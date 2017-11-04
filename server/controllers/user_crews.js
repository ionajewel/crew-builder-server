const db = require('../models');

module.exports = {
  leaveCrew(req, res) {
    let user_id = req.query.user_id;
    let crew_id = req.query.crew_id;
    return db.User_Crew
      .destroy({ where: { crew_id: crew_id, user_id: userId } })
      .then(destroyed => res.status(202).send(destroyed))
      .catch(err => res.status(400).send(err));
  },

  joinCrew(req, res) {
    let user_id = req.query.user_id;
    let crew_id = req.query.crew_id;
    return db.User_Crew
      .create({
        user_id: user_id,
        task_id: task_id,
        role: 'member'
      })
      .then(created => res.status(201).send(created))
      .catch(err => res.status(400).send(err));
  }
};