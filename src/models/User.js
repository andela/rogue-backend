import { CryptData } from '../utils';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Username is required.',
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required.',
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required.',
        }
      }
    },
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
            where: {
              email: value
            }
          });

          if (user) {
            throw new Error('User details already exist.');
          }
        }
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4],
          msg: 'Gender must be at least 4 characters long.'
        },
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      }
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4],
          msg: 'Language must be at least 4 characters long.'
        },
      }
    },
    preferredCurrency: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Currency must be at least 3 characters long.'
        },
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'City must be at least 3 characters long.'
        },
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'State must be at least 3 characters long.'
        },
      }
    },
    zip: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Zip must be at least 3 characters long.'
        },
      }
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3],
          msg: 'Country must be at least 3 characters long.'
        },
      }
    },
    role: {
      type: DataTypes.ENUM(['Super Administrator', 'Travel Administrator',
        'Travel Team Member', 'Manager', 'Requester'])
    },
    department: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6],
          msg: 'Department must be at least 6 characters long.'
        },
      }
    },
    lineManager: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6],
          msg: 'Line manager must be at least 6 characters long.'
        },
      }
    },
    hasProfile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required.',
        },
        len: {
          args: [6, 150],
          msg: 'Password must be more than 5 characters'
        }
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'The URL sent is not a valid URL.'
        }
      }
    },
    rememberDetails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: models => {
        User.hasMany(models.Requests, {
          foreignKey: 'userId',
          as: 'users_request',
        });
      }
    }
  });

  User.beforeCreate(async user => {
    user.password = await CryptData.encryptData(user.password);
  });

  User.beforeUpdate(async user => {
    user.password = await CryptData.encryptData(user.password);
  });

  User.associate = models => {
    User.hasMany(models.Request, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  // eslint-disable-next-line func-names
  User.prototype.verifyPassword = async function (clearPassword) {
    const isPasswordCorrect = await CryptData
      .decryptData(clearPassword, this.password);
    return isPasswordCorrect;
  };
  return User;
};
