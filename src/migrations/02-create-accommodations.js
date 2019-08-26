module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Accommodations', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    vacantNumber: {
      type: Sequelize.INTEGER
    },
    image: {
      type: Sequelize.STRING,
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

  down: queryInterface => queryInterface.dropTable('Accommodations')
};
