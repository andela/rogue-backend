module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING
    },
    birthdate: {
      type: Sequelize.DATE
    },
    preferredLanguage: {
      type: Sequelize.STRING
    },
    preferredCurrency: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    zip: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Requester'
    },
    department: {
      type: Sequelize.STRING
    },
    lineManager: {
      type: Sequelize.STRING
    },
    hasProfile: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isSubscribed: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profileImage: {
      type: Sequelize.STRING,
    },
    rememberDetails: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),

  down: queryInterface => queryInterface.dropTable('Users')
};
