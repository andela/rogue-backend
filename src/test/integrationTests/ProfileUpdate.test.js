/* eslint-disable max-len */
/* eslint-disable no-shadow */
import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../..';
import { generateRandomUser } from '../../utils/helper';

chai.use(chaiHTTP);
const signupRoute = '/api/v1/auth/signup_test';

const user = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: generateRandomUser(),
  password: 'aPa55w0rD'
};
const updatePayload = {
  firstName: 'Kelechi',
  lastName: 'Janet',
  password: 'ejie565ewiw',
  birthdate: '1/5/2018',
  gender: 'female',
  preferredLanguage: 'English',
  preferredCurrency: 'USD',
  city: 'Enugu',
  state: 'Enugu',
  zip: '154587',
  country: 'Nigeria',
  role: 'SuperAdmin',
  department: 'Accounting',
  lineManager: 'Daniels',
};

before('Get authentication token', done => {
  chai
    .request(server)
    .post(signupRoute)
    .send(user)
    .then(res => {
      const userToken = res.body.data.token;
      const { id } = res.body.data;

      it('should redirect users after signin if profile is incomplete', done => {
        chai.request(server)
          .post('/api/v1/auth/signin_test')
          .send({
            email: user.email,
            password: user.password,
          })
          .end((err, res) => {
            expect(res.body.success).to.equal(false);
            expect(res.body.status).to.equal(404);
            expect(res.body.error).to.equal('No profile set up. Redirecting to profile settings page...');
            done();
          });
      });

      it('should be able to update a user profile', done => {
        chai.request(server)
          .patch(`/api/v1/auth/user/${parseInt(id, 10)}`)
          .set('authorization', `Bearer ${userToken}`)
          .send(updatePayload)
          .end((err, res) => {
            expect(res.body.data.firstName).to.equal(updatePayload.firstName);
            expect(res.body.data.lastName).to.equal(updatePayload.lastName);
            expect(res.body.data.preferredLanguage).to.equal(updatePayload.preferredLanguage);
            expect(res.body.data.preferredCurrency).to.equal(updatePayload.preferredCurrency);
            expect(res.body.data.city).to.equal(updatePayload.city);
            expect(res.body.data.state).to.equal(updatePayload.state);
            expect(res.body.data.zip).to.equal(updatePayload.zip);
            expect(res.body.data.country).to.equal(updatePayload.country);
            expect(res.body.data.role).to.equal(updatePayload.role);
            expect(res.body.data.department).to.equal(updatePayload.department);
            expect(res.body.data.lineManager).to.equal(updatePayload.lineManager);
            done();
          });
      });

      it('should redirect users after signin to the request page', done => {
        chai.request(server)
          .post('/api/v1/auth/signin_test')
          .send({
            email: user.email,
            password: updatePayload.password,
          })
          .end((err, res) => {
            expect(res.body.success).to.equal(true);
            expect(res.body.status).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data.firstName).to.equal(updatePayload.firstName);
            expect(res.body.data.lastName).to.equal(updatePayload.lastName);
            expect(res.body.data.preferredLanguage).to.equal(updatePayload.preferredLanguage);
            expect(res.body.data.preferredCurrency).to.equal(updatePayload.preferredCurrency);
            expect(res.body.data.city).to.equal(updatePayload.city);
            expect(res.body.data.state).to.equal(updatePayload.state);
            expect(res.body.data.zip).to.equal(updatePayload.zip);
            expect(res.body.data.country).to.equal(updatePayload.country);
            expect(res.body.data.role).to.equal(updatePayload.role);
            expect(res.body.data.department).to.equal(updatePayload.department);
            expect(res.body.data.lineManager).to.equal(updatePayload.lineManager);
            done();
          });
      });

      it('should be able fetch current settings of user', done => {
        chai.request(server)
          .get(`/api/v1/auth/user/${id}`)
          .set('authorization', `Bearer ${userToken}`)
          .send(updatePayload)
          .end((err, res) => {
            expect(res.body.data.firstName).to.equal(updatePayload.firstName);
            expect(res.body.data.lastName).to.equal(updatePayload.lastName);
            expect(res.body.data.preferredLanguage).to.equal(updatePayload.preferredLanguage);
            expect(res.body.data.preferredCurrency).to.equal(updatePayload.preferredCurrency);
            expect(res.body.data.city).to.equal(updatePayload.city);
            expect(res.body.data.state).to.equal(updatePayload.state);
            expect(res.body.data.zip).to.equal(updatePayload.zip);
            expect(res.body.data.country).to.equal(updatePayload.country);
            expect(res.body.data.role).to.equal(updatePayload.role);
            expect(res.body.data.department).to.equal(updatePayload.department);
            expect(res.body.data.lineManager).to.equal(updatePayload.lineManager);
            done();
          });
      });
      done();
    })
    .catch(done);
});

