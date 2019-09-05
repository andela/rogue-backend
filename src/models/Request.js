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
    destination: {
      type: DataTypes.STRING,
    },
    flightDate: {
      type: DataTypes.DATEONLY,
    },
    multiDestination: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    multiflightDate: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status: {
      type: DataTypes.ENUM,
      values: ['open', 'approved', 'confirmed', 'rejected'],
      defaultValue: 'open'
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
    returnTrip: {
      type: DataTypes.BOOLEAN,
    },
  });

  Request.associate = models => {
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
