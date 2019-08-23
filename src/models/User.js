const hash = require('bcryptjs');

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3],
            msg: 'Firstname cannot be less than 3 characters',
          },

          isAlpha: {
            args: true,
            msg: 'Firstname can only contain alphabets'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3],
            msg: 'Firstname cannot be less than 3 characters',
          },

          isAlpha: {
            args: true,
            msg: 'Firstname can only contain alphabets'
          }
        }
      },
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
          
          notNull: {
            args: true,
            msg: 'Password field cannot be empty.'
          }
        }
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'staff',

      }
    },
    {
      classMethods: {
        associate: models => {
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
