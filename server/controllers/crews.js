const db = require('../models');

module.exports = {
  getCrewsByUser(req, res) {
    let user_id = req.query.user_id;
    let leader,
      member;
    return db.Crew
      .findAll({ include: [{ model: db.User_Crew, where: { user_id: user_id, role: 'leader' } }] })
      .then(crews => {
        leader = crews;
        return db.Crew
          .findAll({ include: [{ model: db.User_Crew, where: { user_id: user_id, role: 'member' } }] });
      })
      .then(crews => {
        member = crews;
        res.status(200).send({leader: leader, member: member});
      })
      .catch(err => res.status(401).send(err));
  },

  searchCrews(req, res) {
    if (req.query.qs) {
      let qs = `%${qs}%`;
      return db.Crew
        .findAll({ where: { $or: { name: { $iLike: qs }, description: { $iLike: qs } } } })
        .then(crews => res.status(200).send(crews))
        .catch(err => res.status(404).send(err));
    } else {
      return db.Crew
        .findAll()
        .then(crews => res.status(200).send(crews))
        .catch(err => res.status(404).send(err));
    }
  },

  newCrew(req, res) {
    let crew = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
    };
    let user_id = req.body.user_id;
    return db.Crew
      .create(crew)
      .then(created => db.User_Crew.create({user_id: user_id, crew_id: created.id, role: 'leader'}))
      .then(created => res.status(201).send(created))
      .catch(err = res.status(400).send(err));
  }
};