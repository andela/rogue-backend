import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST/ Create accomodation facility', () => {
  describe('test to create accomodation facility', () => {
    it('should enable a travel Admin to create accomodation facility', async () => {
      const roleDetails = {
        id: 3,
        username: 'Thomas?',
        roleDetials: 'Travel Administrator',
      };
      const response = await chai
        .request(app)
        .post('/api/v1/accomodation')
        .set({
          'x-access-token': token
        })
        .send({
          id: 2,
          name: 'Oriental Hotel',
          roomName: 'The legend',
          roomType: 'advance',
          address: '55, Nnamdi Azikwe road lagos',
          vacantNumber: 106,
          image: ''
        });
      expect(response.body).to.have.property('success');
      expect(response.body.success).to.equal(true);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to
        .equal('Accomodation created successfully');
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.all.keys('id', 'name', 'roomName', 'roomType', 'address', 'vacantNumber', 'image');
    });
  });
});

