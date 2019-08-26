module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Accommodations', [
    {
      id: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      name: 'Southern Sun Ikoyi Hotel',
      address: '47, Alfred Rewane Road, Ikoyi',
      roomName: 'A1',
      roomType: 'Premium',
      vacantNumber: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9c41e609-7a30-4211-9d10-146a9c54ee74',
      name: 'Southern Sun Ikoyi Hotel',
      address: '174, Owolabi street, Yaba',
      roomName: 'C3',
      roomType: '2 bedroom',
      vacantNumber: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '35106536-deb5-4111-bd90-9ddfac5d348b',
      name: 'Sharaton Hotels',
      address: '26 Bankole showo Close, VI',
      roomName: 'B2',
      vacantNumber: '1',
      roomType: 'Executive',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Accommodations', null, {})
};
