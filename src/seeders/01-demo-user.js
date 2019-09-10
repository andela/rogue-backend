import {
  CryptData
} from '../utils';

const init = async () => {
  const password = await CryptData.encryptData('password');
  return password;
};

module.exports = {
  up: async queryInterface => queryInterface.bulkInsert('Users', [
    {
      id: '96dc6b6d-7a77-4322-8756-e22f181d952c',
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo1@demo.com',
      username: 'user1',
      isVerified: true,
      isSubscribed: true,
      role: 'Super Administrator',
      password: await init(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo2@demo.com',
      username: 'user2',
      isVerified: true,
      isSubscribed: true,
      password: await init(),
      role: 'Manager',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo3@demo.com',
      username: 'user3',
      isVerified: true,
      isSubscribed: true,
      password: await init(),
      role: 'Manager',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4712fc7e-ca41-457f-872e-4a64b79efbba',
      firstName: 'Mba',
      lastName: 'Ifeanyi',
      email: 'demo4@demo.com',
      username: 'user4',
      password: await init(),
      isVerified: true,
      isSubscribed: true,
      role: 'Requester',
      lineManager: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'fb4f94a2-ccb6-11e9-a32f-2a2ae2dbcce4',
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo5@demo.com',
      username: 'user5',
      password: await init(),
      isVerified: true,
      isSubscribed: true,
      role: 'Requester',
      lineManager: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {}),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
