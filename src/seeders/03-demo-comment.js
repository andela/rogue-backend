module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Comments', [
    {
      id: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      userId: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      username: 'gmemmy',
      accommodationFacility: 'Eko Hotels and Suites',
      comment: 'The best hotel there is for a barefoot nomad.',
      profileImage: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiP',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4712fc7e-ca41-457f-872e-4a64b79efbba',
      userId: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      username: 'JohnDoe',
      accommodationFacility: 'Eko Hotels and Suites',
      comment: 'A home away from home. Top notch service.',
      profileImage: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiP',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Comments', null, {})
};
