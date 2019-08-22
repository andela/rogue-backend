import chai, { expect, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../..';

should();
chai.use(chaiHTTP);
const signupRoute = '/api/v1/auth/signup';
const signinRoute = '/api/v1/auth/signin';
const existingUser = {
  email: 'demo@demo.com',
  password: 'password'
};

const shortPassword = {
  email: 'john1@doe.com',
  password: 'short'
};

const nonAlphaNumPassword = {
  email: 'john2@doe.com',
  password: 'isThisInvalid!? :-)'
};

const invalidEmail = {
  email: 'invalidEmail',
  password: 'noNeedForPasswordAnyMore'
};

const nullEmail = {
  password: 'noNeedForPasswordAnyMore'
};

const nullPassword = {
  email: 'john3@doe.com'
};

const user = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane042@doe.com',
  password: 'aPa55w0rD'
};

const runErrorTest = (done, object, route = signupRoute) => {
  chai
    .request(server)
    .post(route)
    .send(object)
    .then(res => {
      expect(res).to.have.status(400);
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

const runSuccessTest = (done, object, route, code = 200) => {
  chai
    .request(server)
    .post(route)
    .send(object)
    .then(res => {
      expect(res).to.have.status(code);
      const { body, status: statusCode } = res;
      expect(body).to.be.an('object');
      expect(body).to.have.property('data');
      expect(body).to.have.property('success');
      const { data, success } = body;
      expect(success).to.be.eql(true);
      expect(data).to.be.an('object');
      expect(data).to.have.property('id');
      expect(data).to.have.property('token');
      const { status } = body;
      expect(status).to.eql(statusCode);
      done();
    })
    .catch(done);
};

describe.only('USER SIGN UP VALIDATION', () => {
  it('should throw error 400 when user signs up with existing email', done => {
    runErrorTest(done, existingUser);
  });

  it('should throw error 400 when user signs up with a short password', done => {
    runErrorTest(done, shortPassword);
  });

  it('should throw error 400 when user signs up with a non-alphanumeric password', done => {
    runErrorTest(done, nonAlphaNumPassword);
  });

  it('should throw error 400 when user signs up with an invalid email', done => {
    runErrorTest(done, invalidEmail);
  });

  it('should throw error 400 when user signs up with a null email', done => {
    runErrorTest(done, nullEmail);
  });

  it('should throw error 400 when user signs up with a null password', done => {
    runErrorTest(done, nullPassword);
  });

  it('should throw error 400 when user signs up with a null email and null password', done => {
    runErrorTest(done);
  });
});

describe('USER SIGN UP ROUTE', () => {
  it('should create a new user', done => {
    runSuccessTest(done, user, signupRoute, 201);
  });
});

describe('USER SIGN IN ROUTE', () => {
  it('should sign in an existing user', done => {
    runSuccessTest(done, existingUser, signinRoute);
  });

  it('should throw error 400 when user signs in with an unregistered user', done => {
    const unregisteredUser = { ...user, email: 'unregistered@user.com' };
    runErrorTest(done, unregisteredUser, signinRoute);
  });
});
