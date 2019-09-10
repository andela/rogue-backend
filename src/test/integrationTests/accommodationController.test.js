import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration Tests For Accommodation Controller', () => {
  describe('Test book accommodation controller', () => {
    const accommodationDetails = {
      name: 'Southern Sun Ikoyi Hotel',
      address: '174, Owolabi street, Yaba',
      roomName: 'C3',
      roomType: '2 bedroom',
      vacantNumber: '1',
    };
    let token;
    before('Get Token', async () => {
      const loginResponse = await chai.request(app).post('/api/v1/auth/login')
        .send({
          email: 'demo2@demo.com',
          password: 'password',
        });
      token = loginResponse.body.data.userDetails.token;
    });
    it('should book an accommodation for a user', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send(accommodationDetails).set('x-access-token', token);
      expect(response.status).to.deep.equal(201);
      expect(response.body.data).to.have.property('success');
      expect(response.body.data.success).to.equal(true);
      expect(response.body.data).to.have.property('message');
      expect(response.body.data.message)
        .to.equal('Accommodation booked successfully');
    });
    it('should return client error when some details are missing', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send().set({ 'x-access-token': token });
      expect(response.status).to.deep.equal(400);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('The "name" field is required');
    });
    it('should return error for missing token', async () => {
      const response = await chai.request(app).post('/api/v1/accommodation')
        .send(accommodationDetails);
      expect(response.status).to.deep.equal(401);
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(false);
      expect(response.body).to.have.property('message');
      expect(response.body.message)
        .to.equal('User not authorized');
    });
  });
});
