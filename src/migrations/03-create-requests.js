module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    origin: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    destination: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    flightDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    returnDate: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    reason: {
      type: Sequelize.ENUM,
      values: ['BUSINESS', 'VACATION', 'EXPEDITION'],
      defaultValue: 'BUSINESS'
    },
    accommodationId: {
      type: Sequelize.UUID,
      references: {
        model: 'Accommodations',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.ENUM,
      values: ['open', 'approved', 'rejected'],
      defaultValue: 'open'
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

  down: queryInterface => queryInterface.dropTable('Requests')
};
