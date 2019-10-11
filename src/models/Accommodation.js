export default (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vacantNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The URL sent is not a valid URL.'
        }
      }
    },
  }, { tableName: 'Accommodations' });

  Accommodation.associate = models => {
    Accommodation.hasMany(models.Request, {
      foreignKey: 'accommodationId',
    });
    Accommodation.hasMany(models.BookedAccommodation, {
      foreignKey: 'accommodationId',
    });
    Accommodation.belongsToMany(models.User, {
      through: 'booked',
      as: 'User'
    });
  };

  return Accommodation;
};

