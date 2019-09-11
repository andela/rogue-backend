export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    receiver: DataTypes.STRING,
  });

  Notification.associate = () => {
  };

  return Notification;
};
