'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Crew = sequelize.define('User_Crew', {
    points: DataTypes.INTEGER,
    achievement: DataTypes.STRING,
    role: DataTypes.STRING
  });

  User_Crew.associate = models => {
    User_Crew.belongsTo(models.User, {foreignKey: 'user_id'});
    User_Crew.belongsTo(models.Crew, {foreignKey: 'crew_id'});
  };

  return User_Crew;
};