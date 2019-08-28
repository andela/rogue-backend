module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Destinations', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    requestId: {
      type: Sequelize.UUID,
      references: {
        model: 'Requests',
        key: 'id'
      }
    },
    destination: {
      type: Sequelize.STRING
    },
    flightDate: {
      type: Sequelize.STRING
    },
    multiDestination: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    multiflightDate: {
      type: Sequelize.ARRAY(Sequelize.DATEONLY),
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

  down: queryInterface => queryInterface.dropTable('Destinations')
};
