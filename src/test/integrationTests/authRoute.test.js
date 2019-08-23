/* eslint-disable camelcase */
import chai, { expect, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../..';

should();
chai.use(chaiHTTP);
const route = '/api/v1/auth/signup';
const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo@demo.com',
  password: 'doN0tCopyMyPa55word'
};
const validUser2 = {
  firstName: 'zayn',
  lastName: 'malik',
  email: 'zaynMalik@gmail.com',
  password: 'doNotCoppyMy55word'
};

const shortPassword = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john1@doe.com',
  password: 'short'
};

const nonAlphaNumPassword = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john2@doe.com',
  password: 'isThisInvalid!? :-)'
};

const invalidEmail = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'invalidEmail',
  password: 'noNeedForPasswordAnyMore'
};

const nullEmail = {
  firstName: 'John',
  lastName: 'Doe',
  password: 'noNeedForPasswordAnyMore'
};

const nullPassword = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john3@doe.com'
};

const runTest = (done, object = {}, code) => {
  chai
    .request(server)
    .post(route)
    .send(object)
    .then(res => {
      expect(res).to.have.status(code);
      const { body } = res;
      expect(body).to.be.an('object');
      expect(res.status).to.eql(code);
      done();
    })
    .catch(done);
};

describe('USER VALIDATION TEST', () => {
  it('should throw error 400 when user signs up with existing email', done => {
    runTest(done, validUser, 400);
  });

  it('should throw error 400 when user signs up with a short password', done => {
    runTest(done, shortPassword, 400);
  });

  it('should throw error 400 when user signs up with a non-alphanumeric password', done => {
    runTest(done, nonAlphaNumPassword, 400);
  });

  it('should throw error 400 when user signs up with an invalid email', done => {
    runTest(done, invalidEmail, 400);
  });

  it('should throw error 400 when user signs up with a null email', done => {
    runTest(done, nullEmail, 400, 'status');
  });

  it('should throw error 400 when user signs up with a null password', done => {
    runTest(done, nullPassword, 400);
  });

  it('should throw error 400 when user signs up with a null email and null password', done => {
    runTest(done, nullEmail, 400);
  });
  it('should return a token after successful registration', done => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(validUser2)
      .end((err, res) => {
        console.log(res.body);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.keys('token', 'status');
        done();
      });
  });
});
