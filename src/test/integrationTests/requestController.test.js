/* eslint-disable no-dupe-keys */
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
    status: 'open'
  };
  let token;

  before('login with an existing user details from the seeded data', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo3@demo.com',
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
      delete tripDetails.origin;
      const response = await chai.request(app).post('/api/v1/request/book_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The "origin" field is required');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
    it('should not book a return trip when a required detail is missing', async () => {
      delete tripDetails.origin;
      const response = await chai.request(app).post('/api/v1/request/book_return_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The "origin" field is required');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
  });

  let managerToken;
  let nonLineManagerToken;

  before('Login to get a managers token', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo2@demo.com',
        password: 'password',
      });
    managerToken = response.body.data.userDetails.token;

    // non line Manager is a Manager but is not the Line manager to the Requester
    const nonLineManager = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo4@demo.com',
        password: 'password',
      });
    nonLineManagerToken = nonLineManager.body.data.userDetails.token;
  });

  describe('Endpoint for availing pending requests', () => {
    it('should let Managers view all pending requests created by '
    + ' their direct reports', async () => {
      const requestResponse = await chai.request(app)
        .get('/api/v1/requests')
        .set('x-access-token', managerToken);
      expect(requestResponse.body.data.success).to.equal(true);
      expect(requestResponse.body.data.pendingRequests).to.be.an('array');
    });

    it('should return error when non-Managers attempt '
    + 'to view pending requests', async () => {
      const requestResponse = await chai.request(app)
        .get('/api/v1/requests')
        .set('x-access-token', nonLineManagerToken);
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('Only managers can perform this action');
    });

    it('should return error when route is accessed without a token', async () => {
      const requestResponse = await chai.request(app)
        .get('/api/v1/requests')
        .set('x-access-token', 'invalid token');
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('User not authorized');
    });

    it('should return error when a Manager who is not the line Manager'
    + 'attempts to get pending requests', async () => {
      const requestResponse = await chai.request(app)
        .get('/api/v1/requests')
        .set('x-access-token', token);
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('There are no pending requests');
    });
  });

  describe('Endpoint for approving pending requests', () => {
    it('should let a Manager approve a pending request created by'
    + ' his direct report', async () => {
      const requestResponse = await chai.request(app)
        .patch('/api/v1/request')
        .set('x-access-token', managerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(requestResponse.body.data.success).to.equal(true);
      expect(requestResponse.body.data.message).to.equal('Request approved successfully');
    });

    it('should return error when non-Managers attempt '
    + 'to approve pending requests', async () => {
      const requestResponse = await chai.request(app)
        .patch('/api/v1/request')
        .set('x-access-token', nonLineManagerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('Only managers can perform this action');
    });

    it('should return error when route is accessed without a token', async () => {
      const requestResponse = await chai.request(app)
        .patch('/api/v1/request')
        .set('x-access-token', 'invalid token')
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('User not authorized');
    });

    it('should return error when a Manager who is not the line Manager'
    + 'attempts to approve pending requests', async () => {
      const requestResponse = await chai.request(app)
        .patch('/api/v1/request')
        .set('x-access-token', managerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('No pending request found or request has been previously approved');
    });
  });
  describe('Test for a manager to reject trip request', () => {
    it('should reject a trip', async () => {
      const rejectedTrip = {
        id: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      };
      const response = await chai
        .request(app)
        .patch('/api/v1/request/reject')
        .set('x-access-token', token)
        .send(rejectedTrip);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to
        .equal('You have successfully rejected this request');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should not reject an already rejected request', async () => {
      const rejectedTrip = {
        id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        origin: 'Mushin',
        destination: 'Bariga',
        flightDate: '2019-06-21',
        returnDate: '2019-03-21',
        accommodationId: '35106536-deb5-4111-bd90-9ddfac5d348b',
        UserId: '4712fc7e-ca41-457f-872e-4a64b79efbba',
        reason: 'BUSINESS',
        status: 'REJECTED',
      };
      const response = await chai
        .request(app)
        .patch('/api/v1/request/reject')
        .set('x-access-token', token)
        .send(rejectedTrip);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('This request has already been rejected');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
  });
  it('should allow a registered user to book a multcity trip', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set('x-access-token', token).send({
        origin: 'Onipan',
        destination: ['mile12', 'okoko'],
        flightDate: ['2019-06-27', '2019-06-25'],
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        return_trip: true,
        reason: 'EXPEDITION'
      });
    expect(response.status).to.equal(201);
    expect(response.body.data).to.have.property('message');
    expect(response.body.data.message).to.equal('Trip booked successfully');
    expect(response.body.data).to.have.property('success');
    expect(response.body.data.success).to.equal(true);
  });
  it('should not book a trip when a required detail is missing', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set('x-access-token', token).send({
        returnDate: '2019-03-21',
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        returnTrip: true,
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        reason: 'EXPEDITION',
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
  it('should not book a multicity trip with one destination', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set('x-access-token', token).send({
        destination: 'okoko',
        flightDate: '2019-03-21',
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        returnTrip: true,
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        reason: 'EXPEDITION',
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('destination as to be more than one');
  });
  it('should not book a trip without an origin', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set('x-access-token', token).send({
        destination: ['mile12', 'okoko'],
        flightDate: ['2019-06-27', '2019-06-25'],
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        returnTrip: true,
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        reason: 'EXPEDITION',
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('The "origin" field is required');
  });
  it('should not allow user to book a trip without a token', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set({ 'x-access-token': '' }).send({
        origin: 'Onipan',
        flightDate: ['2019-06-25', '2019-06-27'],
        destination: ['mile12', 'okoko'],
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        returnTrip: true,
        reason: 'EXPEDITION'
      });
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
  it('user should not be able to book trip without a correct token', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set({ 'x-access-token': 'jksjjjjsjsj' }).send({
        origin: 'Onipan',
        flightDate: ['2019-06-25', '2019-06-27'],
        destination: ['mile12', 'okoko'],
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        returnTrip: true,
        reason: 'EXPEDITION'
      });
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
  it('should not book trip if destination is more than flightDate', async () => {
    const response = await chai.request(app).post('/api/v1/request/multicity')
      .set('x-access-token', token).send({
        origin: 'Onipan',
        flightDate: ['2019-06-25', '2019-06-27'],
        destination: ['mile12', 'okoko', 'onipanu'],
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
        userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
        returnTrip: true,
        reason: 'EXPEDITION'
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
});
