module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    firstName: 'John',
    lastName: 'Doe',
    password: '*****0708@somethingLight*****',
    email: 'obitubechiamaka@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {})
};
