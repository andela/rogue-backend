import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the request controller', () => {
  const tripDetails = {
    origin: 'Lagos',
    destination: 'Kaduna',
    flightDate: '2019-06-21',
    returnDate: '2019-03-21',
    accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
    userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
    reason: 'EXPEDITION',
  };
  let token;
  before('login with an existing user details from the seeded data', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo1@demo.com',
        password: 'password',
      });
    token = response.body.data.userDetails.token;
  });
  describe('Authentication tests', () => {
    it('should return an error if the authentication token is missing', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/request/book_return_trip')
        .send(tripDetails);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
    it('should return error if the authentication token is invalid', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/request/book_return_trip')
        .set('x-access-token', 'hbhfbdhhabdkh')
        .send(tripDetails);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
  });
  describe('Tests for the book a trip features', () => {
    it('should allow a registered user to book a one way trip', async () => {
      const response = await chai.request(app).post('/api/v1/request/book_trip')
        .set('x-access-token', token)
        .send(tripDetails);
      expect(response.status).to.equal(201);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Trip booked successfully');
      expect(response.body.data).to.have.property('tripCreated');
      expect(response.body.data.tripCreated).to.be.an('object');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should allow a registered user to book a return trip', async () => {
      const response = await chai.request(app).post('/api/v1/request/book_return_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(201);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Trip booked successfully');
      expect(response.body.data).to.have.property('tripCreated');
      expect(response.body.data.tripCreated).to.be.an('object');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
  });
  describe('Validation tests for the book a trip features', () => {
    it('should not book a one way trip when a required detail is missing', async () => {
      delete tripDetails.flightDate;
      const response = await chai.request(app).post('/api/v1/request/book_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('The "flightDate" field is required');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
    it('should not book a return trip when a required detail is missing', async () => {
      delete tripDetails.returnDate;
      const response = await chai.request(app).post('/api/v1/request/book_return_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('The returnDate field is required.');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
  });
});
