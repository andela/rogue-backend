export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
  });

  Room.associate = models => {
    Room.hasMany(models.Request, {
      foreignKey: 'accommodationId',
      as: 'accommodation',
    });
  };

  return Room;
};
