import chai from 'chai';
import chaiHttp from 'chai-http';
<<<<<<< HEAD
import app from '../..';
=======
import app from '../../index';
>>>>>>> adds a controller for users to book an accommodation facility

chai.use(chaiHttp);
const { expect } = chai;

<<<<<<< HEAD
describe('Integration tests for the accommodation controller', () => {
  let userToken;
  before('Get user token', async () => {
    const loginResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'demo2@demo.com',
        password: 'password'
      });
    userToken = loginResponse.body.data.userDetails.token;
  });
  describe('Test for like/unlike Accommodation Facility', () => {
    it('should like accommodation', async () => {
      const send = {
        like: true,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Update successful');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.like).to.equal(true);
    });
    it('should unlike accommodation', async () => {
      const send = {
        like: false,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Update successful');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.like).to.equal(false);
    });
    it('should return client error 401 when token is missing', async () => {
      const send = {
        like: true,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .send(send);
      expect(response.status).to.deep.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
    it('should return client error when "like" is missing', async () => {
      const send = {
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        '"like" field is required and must be a boolean'
      );
    });
    it('should return client error when "accommodationId" is missing', async () => {
      const send = {
        like: true
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        "Invalid request. 'accommodationId' field is required"
      );
    });
    it('should return client error when "like" is invalid', async () => {
      const send = {
        like: 'invalid',
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
=======
describe('Integration Tests For Accommodation Controller', () => {
  describe('Test book accommodation controller', () => {
    const accommodationDetails = {
      name: 'Southern Sun Ikoyi Hotel',
      address: '174, Owolabi street, Yaba',
      roomName: 'C3',
      roomType: '2 bedroom',
      vacantNumber: '1',
    };
    let token;
    before('Get Token', async () => {
      const loginResponse = await chai.request(app).post('/api/v1/auth/login')
        .send({
          email: 'demo2@demo.com',
          password: 'password',
        });
      token = loginResponse.body.data.userDetails.token;
    });
    it('should book an accommodation for a user', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send(accommodationDetails).set('x-access-token', token);
      expect(response.status).to.deep.equal(201);
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message)
        .to.equal('Accommodation booked successfully');
    });
    it('should return client error when some details are missing', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send().set({ 'x-access-token': token });
>>>>>>> adds a controller for users to book an accommodation facility
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
<<<<<<< HEAD
      expect(response.body.message).to.equal(
        '"like" field is required and must be a boolean'
      );
    });
    it('should return client error when "accommodationId" is invalid', async () => {
      const send = {
        like: true,
        accommodationId: 'invalid'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('"accommodationId" field is invalid');
    });
    it('should return client error when "accommodationId" does not exist', async () => {
      const send = {
        like: true,
        accommodationId: '8bda0fe3-a55a-4fd9-914d-9d93b53491b6'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(404);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Accommodation does not exist');
=======
      expect(response.body.message)
        .to.equal('The "name" field is required');
    });
    it('should return error for missing token', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send(accommodationDetails);
      expect(response.status).to.deep.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('User not authorized');
>>>>>>> adds a controller for users to book an accommodation facility
    });
  });
});
