'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Task = sequelize.define('User_Task', {
    completed: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN,
    archived: DataTypes.BOOLEAN
  });

  User_Task.associate = models => {
    User_Task.belongsTo(models.User, {foreignKey: 'user_id'});
    User_Task.belongsTo(models.Task, {foreignKey: 'task_id'});
  };

  return User_Task;
};