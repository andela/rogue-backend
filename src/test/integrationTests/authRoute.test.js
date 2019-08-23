/* eslint-disable camelcase */
import chai, { expect, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../..';

should();
chai.use(chaiHTTP);
const route = '/api/v1/auth/signup';
const validUser = {
  email: 'john@doe.com',
  password: 'demo@demo.com'
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

const runTest = (done, object = {}) => {
  chai
    .request(server)
    .post(route)
    .send(object)
    .then(res => {
      expect(res).to.have.status(400);
      const { body } = res;
      expect(body).to.be.an('object');
      expect(body).to.have.property('error');
      const { status } = body;
      expect(status).to.eql(res.status);
      done();
    })
    .catch(done);
};

describe('USER VALIDATION TEST', () => {
  it('should throw error 400 when user signs up with existing email', done => {
    runTest(done, validUser);
  });

  it('should throw error 400 when user signs up with a short password', done => {
    runTest(done, shortPassword);
  });

  it('should throw error 400 when user signs up with a non-alphanumeric password', done => {
    runTest(done, nonAlphaNumPassword);
  });

  it('should throw error 400 when user signs up with an invalid email', done => {
    runTest(done, invalidEmail);
  });

  it('should throw error 400 when user signs up with a null email', done => {
    runTest(done, nullEmail);
  });

  it('should throw error 400 when user signs up with a null password', done => {
    runTest(done, nullPassword);
  });

  it('should throw error 400 when user signs up with a null email and null password', done => {
    runTest(done);
  });
});
