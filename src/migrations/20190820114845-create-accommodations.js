module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Accommodations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    roomName: {
      type: Sequelize.STRING
    },
    roomType: {
      type: Sequelize.STRING
    },
    vacantNumber: {
      type: Sequelize.INTEGER
    },
    image: {
      type: Sequelize.STRING
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
