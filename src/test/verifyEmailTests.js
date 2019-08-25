import chai from 'chai';

import app from '../index';
// eslint-disable-next-line import/no-unresolved
import sendEmail from '../utils/HelperMethods';

const { expect } = chai;

describe('Test for email verification', () => {
  describe('it should send a verification email when a user signs up', () => {
    it('should return send verification email to user', done => {
      try {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.success).to.be.a(true);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('status');
            done();
          });
      } catch (err) {
        throw err.message;
      }
    });
  });
});
