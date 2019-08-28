export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Origin is required.'
        }
      }
    },

    returnDate: {
      type: DataTypes.DATEONLY
    },

    accommodationId: {
      type: DataTypes.INTEGER
    },
    reason: {
      type: DataTypes.ENUM,
      values: ['BUSINESS', 'VACATION', 'EXPEDITION'],
      defaultValue: 'BUSINESS'
    },
    return_trip: {
      type: DataTypes.BOOLEAN,
    },
  });

  Request.associate = models => {
    Request.hasMany(models.Destination, {
      foreignKey: 'requestId',
      as: 'request_id',
    });
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Request.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
    });
  };

  return Request;
};
