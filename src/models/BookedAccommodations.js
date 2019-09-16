export default (sequelize, DataTypes) => {
  const BookedAccommodation = sequelize.define('BookedAccommodation', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    accommodationId: DataTypes.UUID,
    userId: DataTypes.UUID
  }, { tableName: 'BookedAccommodations' });

  return BookedAccommodation;
};
