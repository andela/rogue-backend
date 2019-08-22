import chai from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import app from '../../index';
import MockStrategy from '../unitTests/mockStrategy';
import { passportCb } from '../../config/passport';

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration test for Google social login', () => {
  describe('Test google oauth error handling message', () => {
    it('should not save if user email does not exist', done => {
      const random = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: ''
        }]
      };
      passport.use(new MockStrategy('google', passportCb, random));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/google/redirect', passportCb, random)
        .end((err, res) => {
          expect(res.body.success).to.equal(false);
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('No email address is found for this user');
          done(err);
        });
    });

    it('should not save if user email was not found in the database', done => {
      const random = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: 'okiki1234@yahoo.com'
        }]
      };
      passport.use(new MockStrategy('google', passportCb, random));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/google/redirect', passportCb, random)
        .end((err, res) => {
          expect(res.body.success).to.equal(false);
          expect(res).to.have.status(404);
          expect(res.body.message).to
            .equal('You are not a registered user. Please, signup');
          done(err);
        });
    });

    it('should login a user with correct email', done => {
      const userDetails = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: 'demo2@demo.com'
        }]
      };
      passport.use(new MockStrategy('google', passportCb, userDetails));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/google/redirect', passportCb, userDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.userData).to.be.an('object');
          expect(res.body.data.message).to.equal('Log in successful');
          done(err);
        });
    });
  });
});

describe('Integration test for Facebook social login', () => {
  describe('Test facebook oauth error handling message', () => {
    it('should not save if user email does not exist', done => {
      const random = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: ''
        }]
      };
      passport.use(new MockStrategy('facebook', passportCb, random));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/facebook/redirect', passportCb, random)
        .end((err, res) => {
          expect(res.body.success).to.equal(false);
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('No email address is found for this user');
          done(err);
        });
    });

    it('should not save if user email was not found in the database', done => {
      const random = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: 'okiki1234@yahoo.com'
        }]
      };
      passport.use(new MockStrategy('facebook', passportCb, random));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/facebook/redirect', passportCb, random)
        .end((err, res) => {
          expect(res.body.success).to.equal(false);
          expect(res).to.have.status(404);
          expect(res.body.message).to
            .equal('You are not a registered user. Please, signup');
          done(err);
        });
    });

    it('should login a user with correct email', done => {
      const userDetails = {
        id: 2,
        displayName: 'okiki',
        emails: [{
          value: 'demo4@demo.com'
        }]
      };
      passport.use(new MockStrategy('facebook', passportCb, userDetails));
      const request = chai.request(app);
      request
        .get('/api/v1/auth/facebook/redirect', passportCb, userDetails)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.userData).to.be.an('object');
          expect(res.body.data.message).to.equal('Log in successful');
          done(err);
        });
    });
  });
});
