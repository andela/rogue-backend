export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    accommodationId: DataTypes.UUID,
    userId: DataTypes.UUID
  });

  return Like;
};
