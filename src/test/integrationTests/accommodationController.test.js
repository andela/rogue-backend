import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for the accommodation controller', () => {
  let userToken;
  before('Get user token', async () => {
    const loginResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'demo2@demo.com',
        password: 'password'
      });
    userToken = loginResponse.body.data.userDetails.token;
  });
  describe('Test for like/unlike Accommodation Facility', () => {
    it('should like accommodation', async () => {
      const send = {
        like: true,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Update successful');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.like).to.equal(true);
    });
    it('should unlike accommodation', async () => {
      const send = {
        like: false,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(200);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message).to.equal('Update successful');
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data.like).to.equal(false);
    });
    it('should return client error 401 when token is missing', async () => {
      const send = {
        like: true,
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .send(send);
      expect(response.status).to.deep.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
    });
    it('should return client error when "like" is missing', async () => {
      const send = {
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        '"like" field is required and must be a boolean'
      );
    });
    it('should return client error when "accommodationId" is missing', async () => {
      const send = {
        like: true
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        "Invalid request. 'accommodationId' field is required"
      );
    });
    it('should return client error when "like" is invalid', async () => {
      const send = {
        like: 'invalid',
        accommodationId: '2125be7b-f1f1-4f0a-af86-49c657870b5c'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(
        '"like" field is required and must be a boolean'
      );
    });
    it('should return client error when "accommodationId" is invalid', async () => {
      const send = {
        like: true,
        accommodationId: 'invalid'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('"accommodationId" field is invalid');
    });
    it('should return client error when "accommodationId" does not exist', async () => {
      const send = {
        like: true,
        accommodationId: '8bda0fe3-a55a-4fd9-914d-9d93b53491b6'
      };

      const response = await chai
        .request(app)
        .patch('/api/v1/accommodation/like')
        .set({
          'x-access-token': userToken
        })
        .send(send);
      expect(response.status).to.deep.equal(404);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Accommodation does not exist');
    });
  });
});
