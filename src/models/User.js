import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
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
  });

  User.beforeCreate(user => {
    user.password = bcrypt.hashSync(user.password, 10);
  });

  User.beforeUpdate(user => {
    user.password = bcrypt.hashSync(user.password, 10);
  });

  User.associate = models => {
    User.hasMany(models.Request);
  };

  return User;
};
