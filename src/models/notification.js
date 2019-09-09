'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
     id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
   
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    message:{
      type: DataTypes.STRING,
    }


  });

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

 
  return Notification;
};