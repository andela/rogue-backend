export default (sequelize, DataTypes) => {
  const LikedAccommodation = sequelize.define('LikedAccommodation', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    accommodationId: DataTypes.UUID,
    userId: DataTypes.UUID
  });

  return LikedAccommodation;
};
