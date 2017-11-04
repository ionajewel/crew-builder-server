const db = require('../models');

module.exports = {
  updateTask(req, res) {
    let addPoints, oldPoints;
    let user_id = req.body.user_id;
    let task_id = req.body.task_id;
    if (req.body.verified) {
      return verifyTask(user_id, crew_id)
        .then(updated => db.Task.findOne({
          where: {
            id: task_id
          }
        }))
        .then(task => {
          addPoints = task.points;
          return db.User_Crew.findOne({
            where: {
              user_id: user_id,
              crew_id: task.crew_id
            }
          });
        })
        .then(found => {
          oldPoints = found.points;
          return found.update({
            points: oldPoints + addPoints
          });
        })
        .then(updated => res.status(200).send(updated))
        .catch(err => res.status(400).send(err));
    } else {
      return completeTask()
        .then(updated => res.status(200).send(updated))
        .catch(err => res.status(400).send(err));
    }
  },

  verifyTask(user_id, task_id) {
    return db.User_Task.update({
      verified: true
    }, {
      where: {
        user_id: user_id,
        task_id: task_id
      }
    });
  },

  completeTask(user_id, task_id) {
    return db.User_Task.update({
      completed: true
    }, {
      where: {
        user_id: user_id,
        task_id: task_id
      }
    });
  }

};