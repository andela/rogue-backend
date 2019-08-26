export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'User is required.'
        }
      }
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
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Destination is required.'
        }
      }
    },
    flightDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'FlightDate is required.'
        }
      }
    },
    returnDate: DataTypes.DATEONLY,
    accommodationId: {
      type: DataTypes.INTEGER
    },
    reason: {
      type: DataTypes.ENUM,
      values: ['BUSINESS', 'VACATION', 'EXPEDITION'],
      defaultValue: 'BUSINESS'
    }
  });

  Request.associate = models => {
    Request.belongsTo(models.User);
    Request.belongsTo(models.Accommodation);
  };

  return Request;
};
