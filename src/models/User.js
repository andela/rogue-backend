'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id: { type: DataTypes.INTEGER, primaryKey: true }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};

