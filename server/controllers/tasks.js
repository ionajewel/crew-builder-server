const db = require('../models');

module.exports = {
  getTasksByCrew(req, res) {
    let crew_id = req.query.crew_id;
    return db.Task
      .findAll({
        where: { crew_id: crew_id }
      })
      .then(crews => res.status(200).send(crews))
      .catch(err => res.status(401).send(err));
  },

  getUnverifiedTasks(req, res) {
    let crew_id = req.query.crew_id;
    return db.Task
      .findAll({
        where: { crew_id: crew_id },
        include: [{
          model: db.User_Task,
          where: {completed: true, verified: false},
          include: [{ model: db.User }]
        }]
      })
      .then(tasks => res.status(200).send(tasks))
      .catch(err => res.status(400).send(err));
  },

  newTask(req, res) {
    let taskData = {
      name: req.body.name,
      description: req.body.description,
      points: req.body.points,
      limit: req.body.limit,
      expiry: req.body.expiry,
      crew_id: req.body.crew_id
    };
    return db.Task
      .create(taskData)
      .then(task => res.status(201).send(task))
      .catch(err => res.status(400).send(err));
  },

  deleteTask(req, res) {
    let task_id = req.query.task_id;
    return db.Task
      .destroy({ where: { id: task_id } })
      .then(destroyed => res.status(202).send(destroyed))
      .catch(err => res.status(400).send(err));
  },


  claimTask(req, res) {
    let user_id = req.query.user_id;
    let task_id = req.query.task_id;
    return db.User_Task.create({
      user_id: user_id,
      task_id: task_id,
    })
      .then(created => res.status(201).send(created))
      .catch(err => res.status(400).send(err));
  },

  getTasksByUserCrew(req, res) {
    let user_id = req.query.user_id;
    let crew_id = req.query.crew_id;
    let tasksInProgress,
      tasksUnclaimed;
    return db.Task
      .findAll({
        where: { crew_id: crew_id },
        include: [{ model: db.User_Task, where: { user_id: user_id, verified: false } }] })
      .then(tasks => {
        tasksInProgress = tasks;
        return db.Task
          .findAll({ where: { crew_id: crew_id },
            include: { model: db.User_Task,
              where: {
                user_id: {
                  $notIn: db.User_Task.findAll({ where: { user_id: user_id }, attributes: ['task_id'] })
                }
              }
            }
          });
      })
      .then(tasks => {
        tasksUnclaimed = tasks;
        res.status(200).send({tasksInProgress: tasksInProgress, tasksAvailable: tasksUnclaimed});
      })
      .catch(err => {
        res.status(400).send(err);
      });

  },
};