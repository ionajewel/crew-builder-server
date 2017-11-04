const models = require('../models');
const controllers = require('../controllers');

module.exports = (app) => {
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  app.get('/user/crews', controllers.crews.getCrewsByUser);
  app.get('/user/tasks', controllers.tasks.getTasksByUserCrew);
  app.get('/crew/tasks', controllers.tasks.getTasksByCrew);
  app.get('/crews', constrollers.crews.searchCrews);
  app.get('/leader/members', controllers.users.getCrewMembers);
  app.get('/leader/tasks', controllers.tasks.getUnverifiedTasks);

  app.post('/task', controllers.tasks.newTask);
  app.post('/crew', controllers.crews.newCrew);
  app.post('/user/crews', controllers.user_crews.joinCrew);
  app.post('/user/tasks', controller.tasks.claimTask);

  app.put('/user/tasks', controllers.user_tasks.updateTask);

  app.delete('/user/crews', controllers.user_crews.leaveCrew);
  app.delete('/tasks', controllers.tasks.deleteTask);

};