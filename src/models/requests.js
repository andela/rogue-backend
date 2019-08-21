export default (sequelize, DataTypes) => {
  const Requests = sequelize.define('Requests', {
    userId: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    flightDate: DataTypes.DATEONLY,
    returnDate: DataTypes.DATEONLY,
    AccomodationId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: (models) => {
        Requests.BelongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: 'UserId'
        });
      }
    }
  });
  return Requests;
};
