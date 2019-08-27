import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import { UserController } from '../../controllers';
import { SendEmail } from '../../utils';

chai.use(chaiHttp);
const { expect } = chai;
describe('Integration tests for the user controller', () => {
  describe('Test general error handling and welcome message', () => {
    it('should send an error when there is an unforeseen error', async () => {
      const userDetails = {
        username: 'Thomas?',
        password: 'tomnjerry',
      };
      const response = await chai.request(app).post('/api/v1/auth/signup/%')
        .send(userDetails);
      expect(response.status).to.deep.equal(500);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.error).to.have.property('message');
      expect(response.body.message).to.equal('Something failed');
    });

    it('should send a "Page not found" error when invalid URL is given', async () => {
      const response = await chai.request(app).get('/api/v1/some/funny/url');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The page you are looking for does not exist');
    });

    it('should welcome the user to the BareFoot-Nomad API', async () => {
      const response = await chai.request(app).get('/api/v1/');
      expect(response.status).to.deep.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(true);
      expect(response.body.message).to.equal('Welcome to the BareFoot-Nomad API');
    });
  });
  describe('Test to pre-register a user', () => {
    it('should create a user and send email for verification', async () => {
      const userDetails = {
        username: 'JthnDmkloes',
        password: 'password',
        email: 'johnbvfde@wemail.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const stubCreateTokenAndSendEmail = sinon.stub(
        UserController, 'createTokenAndSendEmail'
      ).returns(true);
      const response = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(response.status).to.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal(
        'An email has been sent to your '
        + 'email address. Please check your email to complete '
        + 'your registration'
      );
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.be.equal(true);
      stubCreateTokenAndSendEmail.restore();
    });
    it('should tell the user to re-register when confirmation '
      + 'email is not sent', async () => {
      const userDetails = {
        username: 'JthnDmkloess',
        password: 'password',
        email: 'johnbvfdse@wemail.com',
        firstName: 'Johns',
        lastName: 'Does',
      };
      const stubCreateTokenAndSendEmail = sinon.stub(
        UserController, 'createTokenAndSendEmail'
      ).returns(false);
      const response = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(response.status).to.equal(500);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        'Your registration could not be completed.'
        + 'Please try again'
      );
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.be.equal(false);
      stubCreateTokenAndSendEmail.restore();
    });
    it('should return an error when any user details is not given', async () => {
      const userDetails = {
        username: 'JohnDoe',
        password: 'password',
        email: 'johndoe@wemail.com',
        firstName: 'John',
      };
      const response = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The "lastName" field is required');
    });
  });
  describe('Test login a user', () => {
    it('should log a user in when valid details are given', async () => {
      const response = await chai.request(app).post('/api/v1/auth/login')
        .send({ email: 'demo1@demo.com', password: 'password' });
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Login successful');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.userDetails).to.be.an('object');
    });
    it('should return client error when user details is missing', async () => {
      const userDetails = {
        email: 'johndoe@wemail.com',
      };
      const response = await chai.request(app).post('/api/v1/auth/login')
        .send(userDetails);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('Invalid request. All fields are required');
    });

    it('should return client error when user details is missing', async () => {
      const userDetails = {
        password: 'johndoe@wemail.com',
      };
      const response = await chai.request(app).post('/api/v1/auth/login')
        .send(userDetails);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('Invalid request. All fields are required');
    });
  });
  describe('Test Reset password controller', () => {
    it('should send an email to users for password reset', async () => {
      const userDetails = { email: 'mbanelsonifeanyi@gmail.com' };
      const stubSendMethod = sinon.stub(SendEmail, 'resetPassword').returns(true);
      const response = await chai.request(app).post('/api/v1/resetpassword')
        .send(userDetails);
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message)
        .to.equal('An email has been sent to you check your email address');
      sinon.assert.calledOnce(stubSendMethod);
      stubSendMethod.restore();
    });
    it('should return client error when user details is missing', async () => {
      const userDetails = '';
      const response = await chai.request(app).post('/api/v1/resetpassword')
        .send(userDetails);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('Invalid request. All fields are required');
    });
    it('should return client error when user details is missing', async () => {
      const response = await chai.request(app).post('/api/v1/resetpassword')
        .send();
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('Invalid request. All fields are required');
    });
    it('should return error for unknown email', async () => {
      const userDetails = {
        email: 'mbanelsonifeanyijohndoe@wemail.com',
      };
      const response = await chai.request(app).post('/api/v1/resetpassword')
        .send(userDetails);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message.message)
        .to.equal('Email does not exist');
    });
  });
});
