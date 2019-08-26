import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the request controller', () => {
  let token;
  before('login with an existing user details from the seeded data', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'demo1@demo.com',
        password: 'password',
      });
    token = response.body.data.userDetails.token;
  });
  it('should allow a registered user to book a trip', async () => {
    const tripDetails = {
      origin: 'Onipan',
      destination: 'Okoko',
      flightDate: '2019-06-21',
      returnDate: '2019-03-21',
      accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
      reason: 'EXPEDITION',
    };
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
  it('should not book a trip when a required detail is missing', async () => {
    const tripDetails = {
      origin: 'Onipan',
      destination: 'Okoko',
      returnDate: '2019-03-21',
      accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c',
      userId: '79ddfd3b-5c83-4beb-815e-55b1c95230e1',
      reason: 'EXPEDITION',
    };
    const response = await chai.request(app).post('/api/v1/request/book_trip')
      .set('x-access-token', token).send(tripDetails);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.equal('The "flightDate" field is required');
    expect(response.body).to.have.property('success');
    expect(response.body.success).to.equal(false);
  });
});
