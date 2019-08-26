export default (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    roomName: DataTypes.STRING,
    roomType: DataTypes.STRING,
    vacantNumber: DataTypes.INTEGER,
    image: DataTypes.STRING
  });

  Accommodation.associate = models => {
    Accommodation.hasMany(models.Request);
  };

  return Accommodation;
};
