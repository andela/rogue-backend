module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Accommodations',
    [
      {
        name: 'Southern Sun Ikoyi Hotel',
        address: '47, Alfred Rewane Road, Ikoyi',
        roomName: 'A1',
        vacantNumber: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Accommodations', null, {})
};
