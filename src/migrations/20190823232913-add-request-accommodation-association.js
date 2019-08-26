module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Requests',
    'accommodationId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Accommodations',
        key: 'id'
      }
    }
  ),

  down: queryInterface => queryInterface.removeColumn(
    'Requests',
    'accommodationId'
  )
};
