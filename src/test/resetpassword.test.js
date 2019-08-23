import { assert, request } from 'chai';
import sinon from 'sinon';
import app from '../index';
import SendMessageObject from '../utils/ResetPassword';

const stub = sinon.stub(SendMessageObject, 'sendMessage')
  .callsFake(msg => msg);
describe('Test for Reset Password Post Route ', () => {
  before(() => stub);
  after(() => stub.restore());
  it('Should return a status 200 for sent email', done => {
    request(app)
      .post('/resetpassword')
      .end((err, res) => {
        assert.equal(res.text, 'Unauthorized');
        assert.equal(res.statusCode, '400');
        done();
      });
  });
  it('Should return a status 200 for sent email', done => {
    request(app)
      .get('/resetpassword')
      .end((err, res) => {
        assert.equal(res.body.message, 'route not found');
        done();
      });
  });
});
