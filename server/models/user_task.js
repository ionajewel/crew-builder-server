'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Task = sequelize.define('User_Task', {
    completed: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    archived: DataTypes.BOOLEAN
  });

  UserTask.associate = models => {
    UserTask.belongsTo(models.User, {foreignKey: 'user_id'});
    UserTask.belongsTo(models.Task, {foreignKey: 'task_id'});
  };

  return User_Task;
};