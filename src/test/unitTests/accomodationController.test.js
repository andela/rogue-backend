import sinon from 'sinon';
import chai from 'chai';
import { AccommodationController } from '../../controllers';
import models from '../../models';

const { expect } = chai;
const { Accommodation } = models;

const req = { decoded: { id: 'some id' } };

const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  }
};

describe('unit test for the Accomodation Controller', () => {
  let stubbedMethod;
  afterEach(() => {
    if (stubbedMethod.restore) stubbedMethod.restore();
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(Accommodation, 'create').throws({
      dataValues: 'some thing'
    });
    const response = await AccommodationController.bookAnAccommodation(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
});
