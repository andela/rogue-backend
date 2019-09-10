import sinon from 'sinon';
import chai from 'chai';
import { UserController } from '../../controllers';
import models from '../../models';

const { expect } = chai;
const { User } = models;
const req = { decoded: { id: 'some id' } };

const res = {
  status() {
    return this;
  },
  json(obj) {
    return obj;
  }
};

describe('unit test for the User Controller', () => {
  let stubbedMethod;
  afterEach(() => {
    if (stubbedMethod.restore) stubbedMethod.restore();
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(User, 'findByPk').throws({
      dataValues: 'some thing'
    });
    const response = await UserController.updateProfile(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(User, 'associate').throws({
      dataValues: 'some thing'
    });
    const response = await UserController.updateProfile(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(User, 'findByPk').throws({
      dataValues: 'some thing'
    });
    const response = await UserController.getProfile(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(User, 'findByPk').throws({
      dataValues: 'some thing'
    });
    const response = await UserController.verifyEmail(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should return a server error when an unexpected error happens', async () => {
    stubbedMethod = sinon.stub(User, 'findOne').throws({
      dataValues: 'some thing'
    });
    const response = await UserController.resetPassword(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
  it('should only allow managers reject a User', async () => {
    stubbedMethod = sinon.stub(User, 'update').throws({ dataValues: 'some thing' });
    const response = await UserController.rememberUserDetails(req, res);
    expect(response).to.have.property('message');
    expect(response.message).to.equal('Internal server error');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
  });
});
