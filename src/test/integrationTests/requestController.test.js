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
  let requestId;
  before('login with an existing user details from the seeded data', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo4@demo.com',
        password: 'password',
      });
    token = response.body.data.userDetails.token;
    const bookTrip = await chai.request(app).post('/api/v1/request/book_trip')
      .set('x-access-token', token)
      .send({
        origin: 'Lagos',
        destination: 'Kaduna',
        flightDate: '2019-06-21',
        returnDate: '2019-08-21',
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      });
    requestId = bookTrip.body.data.tripCreated.id;
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

  describe('Test notification controller', () => {
    it('should serve a html file', async () => {
      const response = await chai.request(app)
        .get('/api/v1/managerNotification/3821b930-ce48-4ac8-9ddf-ee3bf7980d08');
      expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
    });
  });

  describe('Authentication tests', () => {
    it('should return an error if the authentication token is missing', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/request/book_trip')
        .send(tripDetails);
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
    it('should return error if the authentication token is invalid', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/request/book_trip')
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
      const response = await chai.request(app).post('/api/v1/request/book_trip')
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
      const response = await chai.request(app).post('/api/v1/request/book_trip')
        .set('x-access-token', token).send(tripDetails);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The "origin" field is required');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });

    it('should allow a registered user to update a trip request', async () => {
      const response = await chai.request(app).patch('/api/v1/request/edit')
        .set('x-access-token', token).send({
          requestId,
          origin: 'eko',
          destination: 'miami',
          flightDate: '2019-02-01',
          returnDate: '2019-06-04',
          reason: 'VACATION'
        });
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Trip updated successfully');
      expect(response.body.data).to.have.property('updatedData');
      expect(response.body.data.updatedData.origin).to.equal('eko');
      expect(response.body.data.updatedData.destination).to.equal('miami');
      expect(response.body.data.updatedData.reason).to.equal('VACATION');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });

    it('should not allow an update on incorrect date parameters', async () => {
      const response = await chai.request(app).patch('/api/v1/request/edit')
        .set('x-access-token', token).send({
          requestId,
          origin: 'eko',
          destination: 'miami',
          flightDate: '2019-02-01',
          returnDate: '2017-06-04',
          reason: 'VACATION'
        });
      expect(response.status).to.equal(400);
      expect(response.body.message).to
        .equal('The flight date cannot be after the return date');
    });

    it('should not allow an update on invalid request ID', async () => {
      const response = await chai.request(app).patch('/api/v1/request/edit')
        .set('x-access-token', token).send({
          requestId: '3821b930-ce48-4ac8-9ddf-ee3bf7980d08',
          origin: 'eko',
          destination: 'miami',
          flightDate: '2019-02-01',
          returnDate: '2017-06-04',
          reason: 'VACATION'
        });
      expect(response.status).to.equal(404);
      expect(response.body.message).to
        .equal('The request you are trying to edit does not exist');
    });
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
        .to.equal('Only managers can perform this action');
    });
  });

  describe('Endpoint for approving pending requests', () => {
    it('should let a Manager approve a pending request created by'
    + ' his direct report', async () => {
      const requestResponse = await chai.request(app)
        .patch('/api/v1/request/approve')
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
        .patch('/api/v1/request/approve')
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
        .patch('/api/v1/request/approve')
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
        .patch('/api/v1/request/approve')
        .set('x-access-token', token)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(requestResponse.body.success).to.equal(false);
      expect(requestResponse.body.message)
        .to.equal('Only managers can perform this action');
    });
  });
  describe('Test for a manager to reject trip request', () => {
    it('should reject a trip', async () => {
      const rejectedTrip = {
        id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
      };
      const response = await chai
        .request(app)
        .patch('/api/v1/request/reject')
        .set('x-access-token', managerToken)
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
        .set('x-access-token', managerToken)
        .send(rejectedTrip);
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('This request has already been rejected');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
  });
  describe('Test for booking a multi-city trip', () => {
    it('should allow a registered user to book a multi-city trip', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          origin: 'Onipan',
          destination: ['mile12', 'okoko'],
          flightDate: ['2019-06-27', '2019-06-25'],
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          returnTrip: 'true',
          reason: 'EXPEDITION'
        });
      expect(response.status).to.equal(201);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Multi-city trip booked successfully');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should not book a trip when a required detail is missing', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          returnDate: '2019-03-21',
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
    it('should not book a multi-city trip with one destination', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          origin: 'onipanu',
          destination: ['okoko'],
          flightDate: ['2019-03-21'],
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Destination has to be more than one');
    });
    it('should not book a trip without an origin', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          destination: ['mile12', 'okoko'],
          flightDate: ['2019-06-27', '2019-06-25'],
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('Invalid request. \'origin\' field is required');
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
    it('should not book a trip when a required detail is missing', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          returnDate: '2019-03-21',
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
    });
    it('should not book a trip when "destination" field is not an array', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          origin: 'Yaba',
          destination: 'okoko',
          flightDate: '2019-03-21',
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to.equal('Destination has to be more than one');
    });
    it('should not book a trip when the "origin" filed  is missing', async () => {
      const response = await chai.request(app).post('/api/v1/request/multicity')
        .set('x-access-token', token).send({
          destination: ['mile12', 'okoko'],
          flightDate: ['2019-06-27', '2019-06-25'],
          accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
          returnTrip: 'true',
          userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
          reason: 'EXPEDITION',
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('Invalid request. \'origin\' field is required');
    });
  });
  describe('Search functionality tests', () => {
    it('should search request by id', async () => {
      const query = {
        id: '8bda0fe3-a55a-4fd9-914d-9d93b53491b6'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.id === query.id)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by reason', async () => {
      const query = {
        reason: 'BUSINESS'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.reason === query.reason)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by origin', async () => {
      const query = {
        origin: 'Yaba'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.origin === query.origin)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by destination', async () => {
      const query = {
        destination: 'Surulere'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(2);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.destination === query.destination
          || request.multiDestination.includes(query.destination))
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by multi-destination', async () => {
      const query = {
        destination: ['Onipan', 'Surulere']
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(1);
      response.body.data.searchResults.forEach(searchResult => {
        expect(searchResult.multiDestination).to.include.members(query.destination);
      });
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by flightDate', async () => {
      const query = {
        flightDate: '2019-06-21'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(5);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.flightDate === query.flightDate
          || request.multiflightDate.includes(query.flightDate))
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by multi-flightDate', async () => {
      const query = {
        flightDate: ['2019-06-21', '2019-06-22']
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(1);
      response.body.data.searchResults.forEach(searchResult => {
        expect(searchResult.multiflightDate).to.include.members(query.flightDate);
      });
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by returnDate', async () => {
      const query = {
        returnDate: '2019-03-21'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.returnDate === query.returnDate)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by owner', async () => {
      const query = {
        userId: '96dc6b6d-7a77-4322-8756-e22f181d952c'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.userId === query.userId)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request by status', async () => {
      const query = {
        status: 'open'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.status === query.status)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should search request with multiple search', async () => {
      const query = {
        origin: 'Ikeja',
        destination: 'Surulere',
        reason: 'BUSINESS',
        returnDate: '2019-03-21',
        status: 'approved'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Search successful');
      expect(response.body.data).to.have.property('searchResults');
      expect(response.body.data.searchResults)
        .to.be.an('array')
        .that.has.length.greaterThan(0);
      expect(response.body.data.searchResults).to.satisfy(
        requests => requests.every(request => request.origin === query.origin
          && request.destination === query.destination
          && request.reason === query.reason
          && request.returnDate === query.returnDate
          && request.status === query.status)
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
    });
    it('should return client error 401 when token is missing', async () => {
      const query = {
        origin: 'Ikeja',
        destination: 'Surulere',
        reason: 'BUSINESS',
        returnDate: '2019-03-21'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .query(query);
      expect(response.status).to.deep.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
    it('should return client error 400 when query has no valid property', async () => {
      const query = {
        invalid: 'invalid'
      };

      const response = await chai
        .request(app)
        .get('/api/v1/request/search')
        .set('x-access-token', token)
        .query(query);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to
        .equal('Invalid search query.');
    });
  });

  describe('Test For A Manager to Confirm an Approved Travel Request', () => {
    it('should send an error message when a user who isn\'t'
    + ' the line manager attempts to confirm an approved request ', async () => {
      const response = await chai.request(app)
        .patch('/api/v1/request/confirm')
        .set('x-access-token', nonLineManagerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('Only managers can perform this action');
    });

    it('should send an error message when a user'
    + ' tries to access this route without a token', async () => {
      const response = await chai.request(app)
        .patch('/api/v1/request/confirm')
        .set('x-access-token', 'ghbhbjbjbj')
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('User not authorized');
    });

    it('should send an error message when a user'
      + ' tries to access this route with an invalid token', async () => {
      const response = await chai.request(app)
        .patch('/api/v1/request/confirm')
        .set('x-access-token', 'heyiminvalid')
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('User not authorized');
    });

    it('should confirm an approved request', async () => {
      const response = await chai.request(app)
        .patch('/api/v1/request/confirm')
        .set('x-access-token', managerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.message).to
        .equal('Request confirmed successfully');
    });

    it('should return an error if there is no approved request', async () => {
      const response = await chai.request(app)
        .patch('/api/v1/request/confirm')
        .set('x-access-token', managerToken)
        .send({
          id: '1b26c8d1-768d-4bcb-8407-f6d85b1f1dee',
        });
      expect(response.body.success).to.equal(false);
      expect(response.body.message).to
        .equal('This request has already been confirmed');
    });
  });
});
