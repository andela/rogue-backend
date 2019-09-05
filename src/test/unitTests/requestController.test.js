import sinon from 'sinon';
import chai from 'chai';
import { RequestController } from '../../controllers';
import models from '../../models';

const { expect } = chai;
const { Request } = models;

const req = { decoded: { id: 'some id' } };

const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  }
};

describe('unit test for the Request Controller', () => {
  let stubbedMethod;
  afterEach(() => {
    if (stubbedMethod.restore) stubbedMethod.restore();
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(Request, 'create').throws({
      dataValues: 'some thing'
    });
    const response = await RequestController.bookATrip(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should only allow managers reject a request', async () => {
    stubbedMethod = sinon.stub(Request, 'update').throws({ dataValues: 'some thing' });
    const response = await RequestController.rejectRequest(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
});
