export default (sequelize, DataTypes) => {
  const Accommodations = sequelize.define('Accommodations', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    roomName: DataTypes.STRING,
    roomType: DataTypes.STRING,
    vacantNumber: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Accommodations.hasMany(models.User, {
          onDelete: 'CASCADE',
          foreignKey: 'AccommodationsId'
        });
      }
    }
  });
  return Accommodations;
};
