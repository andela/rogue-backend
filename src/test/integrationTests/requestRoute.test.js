import chai, { expect, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../..';

should();
chai.use(chaiHTTP);
const requestRoute = '/api/v1/request';
const signinRoute = '/api/v1/auth/signin';
const user = {
  email: 'demo@demo.com',
  password: 'password'
};

const in2Days = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date;
};

const validTrip = {
  accommodationId: '1',
  origin: 'Lagos',
  destination: 'Dubai',
  flightDate: in2Days()
};

let userToken;

const runErrorTest = (done, object, errorCode = 400, aToken = userToken) => {
  chai
    .request(server)
    .post(requestRoute)
    .set('Authorization', aToken)
    .send(object)
    .then(res => {
      expect(res).to.have.status(errorCode);
      const { body, status: statusCode } = res;
      expect(body).to.be.an('object');
      expect(body).to.have.property('error');
      expect(body).to.have.property('success');
      const { status } = body;
      expect(status).to.eql(statusCode);
      done();
    })
    .catch(done);
};

const runSuccessTest = (done, object) => {
  chai
    .request(server)
    .post(requestRoute)
    .set('Authorization', userToken)
    .send(object)
    .then(res => {
      expect(res).to.have.status(201);
      const { body, status: statusCode } = res;
      expect(body).to.be.an('object');
      expect(body).to.have.property('data');
      expect(body).to.have.property('success');
      const { data, success } = body;
      expect(success).to.be.eql(true);
      expect(data).to.be.an('object');
      expect(data).to.have.property('id');
      const { status } = body;
      expect(status).to.eql(statusCode);
      done();
    })
    .catch(done);
};

describe('TRIP REQUEST TEST', () => {
  before('Get user token', done => {
    chai
      .request(server)
      .post(signinRoute)
      .send(user)
      .then(res => {
        expect(res).to.have.status(200);
        userToken = res.body.data.token;
        done();
      })
      .catch(done);
  });

  it('should book a trip request', done => {
    runSuccessTest(done, validTrip);
  });

  it('should book a trip request without accommodation', done => {
    const { accommodation, ...noAccommodationTrip } = validTrip;
    runSuccessTest(done, noAccommodationTrip);
  });

  it('should throw error 401 when trip has no token', done => {
    runErrorTest(done, validTrip, 401, null);
  });

  it('should throw error 400 when trip has no origin', done => {
    const { origin, ...noOriginTrip } = validTrip;
    runErrorTest(done, noOriginTrip);
  });

  it('should throw error 400 when trip has no destination', done => {
    const { destination, ...noDestinationTrip } = validTrip;
    runErrorTest(done, noDestinationTrip);
  });

  it('should throw error 400 when trip has no flightDate', done => {
    const { flightDate, ...noFlightDateTrip } = validTrip;
    runErrorTest(done, noFlightDateTrip);
  });

  it('should throw error 400 when trip has invalid accommodation', done => {
    runErrorTest(done, { ...validTrip, accommodationId: '-1' });
  });
});
