export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    requestId: {
      type: DataTypes.UUID,
    },
    userId: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'notification content cannot be empty'
        }
      }
    },
    isRead: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      allowNull: false,
    }
  });

  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Notification.belongsTo(models.Request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE',
    });
  };

  return Notification;
};

