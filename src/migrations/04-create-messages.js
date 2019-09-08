module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Messages', {
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
    lineManager: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
      }
    },
    type: {
      type: Sequelize.ENUM,
      values: ['approval', 'rejection', 'edition', 'creation'],
    },
    message: {
      type: Sequelize.STRING,
    },
    isRead: {
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
    },
  }),

  down: queryInterface => queryInterface.dropTable('Messages')
};

