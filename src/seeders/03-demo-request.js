module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Requests', [
    {
      id: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      origin: 'Yaba',
      destination: 'Ikoyi',
      flightDate: '2019-06-21',
      returnDate: '2019-03-21',
      accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      userId: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      reason: 'VACATION',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8bda0fe3-a55a-4fd9-914d-9d93b53491b6',
      origin: 'Ikeja',
      destination: 'Surulere',
      flightDate: '2019-06-21',
      returnDate: '2019-03-21',
      accommodationId: '9c41e609-7a30-4211-9d10-146a9c54ee74',
      userId: '96dc6b6d-7a77-4322-8756-e22f181d952c',
      reason: 'BUSINESS',
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'a5cb8ebe-7e39-4a8f-a6cd-6ff399dcc273',
      origin: 'Onipan',
      destination: 'Okoko',
      flightDate: '2019-06-21',
      returnDate: '2019-03-21',
      accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
      reason: 'EXPEDITION',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
      origin: 'Mushin',
      destination: 'Bariga',
      flightDate: '2019-06-21',
      returnDate: '2019-03-21',
      accommodationId: '35106536-deb5-4111-bd90-9ddfac5d348b',
      userId: '4712fc7e-ca41-457f-872e-4a64b79efbba',
      reason: 'BUSINESS',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'ee712af7-d4dc-483a-b7c1-294167b4d104',
      origin: 'Mushin',
      multiDestination: ['Surulere', 'Onipan'],
      multiflightDate: ['2019-06-21', '2019-06-22'],
      returnDate: '2019-03-21',
      accommodationId: '35106536-deb5-4111-bd90-9ddfac5d348b',
      userId: '4712fc7e-ca41-457f-872e-4a64b79efbba',
      reason: 'BUSINESS',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'f86b7762-607e-4c62-b0cd-982f08f1bec1',
      origin: 'Agege',
      multiDestination: ['Surulere', 'Ikeja', 'Onipan'],
      multiflightDate: ['2019-06-21', '2019-06-22', '2019-06-23'],
      returnDate: '2019-07-01',
      accommodationId: '35106536-deb5-4111-bd90-9ddfac5d348b',
      userId: '4712fc7e-ca41-457f-872e-4a64b79efbba',
      reason: 'BUSINESS',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Requests', null, {})
};
