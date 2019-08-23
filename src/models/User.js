export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Email address is invalid.'
          },
          notNull: {
            args: true,
            msg: 'Email address cannot be empty.'
          },
          async exists(value) {
            const user = await User.findOne({
              where: { email: value }
            });

            if (user) {
              throw new Error('User details already exist.');
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6],
            msg: 'Password must be at least 6 characters long.'
          },
          isAlphanumeric: {
            args: true,
            msg: 'Password must be alphanumeric only.'
          },
          notNull: {
            args: true,
            msg: 'Password field cannot be empty.'
          }
        }
      }
    },
    {
      classMethods: {
        associate: (models) => {
          User.hasMany(models.Requests, {
            onDelete: 'CASCADE',
            foreignKey: 'UserId'
          });
          User.hasOne(models.Accomodations, {
            foreignKey: 'UserId',
            onDelete: 'CASCADE'
          });
        }
      }
    }
  );
  return User;
};
