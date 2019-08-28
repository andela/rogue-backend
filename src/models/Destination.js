export default (sequelize, DataTypes) => {
  const Destination = sequelize.define('Destination', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    destination: {
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     msg: 'Destination is required.',
      //   }
      // }
    },
    multiDestination: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      // validate: {
      //   notEmpty: {
      //     msg: 'Destination is required.',
      //   }
      // }
    },
    flightDate: {
      type: DataTypes.DATEONLY
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'FlightDate is required.'
      //   }
      // }
    },
    multiflightDate: {
      type: DataTypes.ARRAY(DataTypes.DATEONLY),
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'FlightDate is required.'
      //   }
      // }
    },
  });

  Destination.associate = models => {
    Destination.belongsTo(models.Request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE',
    });
  };
  return Destination;
};
