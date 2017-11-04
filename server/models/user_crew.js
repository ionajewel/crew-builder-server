'use strict';
module.exports = (sequelize, DataTypes) => {
  var User_Crew = sequelize.define('User_Crew', {
    points: DataTypes.INTEGER,
    achievement: DataTypes.STRING,
    role: DataTypes.STRING
  });

  UserCrew.associate = models => {
    UserCrew.belongsTo(models.User, {foreignKey: 'user_id'});
    UserCrew.belongsTo(models.Crew, {foreignKey: 'crew_id'});
  };

  return User_Crew;
};