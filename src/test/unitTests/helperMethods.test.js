import chai from 'chai';
import { HelperMethods, Notification } from '../../utils';
/* eslint-disable no-unused-expressions */
const { expect, request } = chai;
const user = {
  id: '96dc6b6d-7a77-4322-8756-e22f181d952c',
  firstName: 'John',
  lastName: 'Doe',
  email: 'demo1@demo.com',
  username: 'user1',
  isVerified: true,
  isSubscribed: true,
  role: 'Super Administrator',
  password: '8888',
  createdAt: new Date(),
  updatedAt: new Date()
};
const res = {
  status() { return this; },
  json(obj) { return obj; }
};

describe('Unit tests for helper methods', () => {
  it('should send an "Internal server error" message', () => {
    const response = HelperMethods.serverError(res);
    expect(response).to.have.property('message');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
    expect(response.message).to.equal('Internal server error');
  });
  it('should return 400 status code and the error '
    + 'message when "clientError" method is called', () => {
    const response = HelperMethods.clientError(res, 'custom client error message');
    expect(response).to.have.property('message');
    expect(response).to.have.property('success');
    expect(response.success).to.equal(false);
    expect(response.message).to.equal('custom client error message');
  });
  it('should return 400 status code and the error '
    + 'message when "clientError" method is called', () => {
    const response = Notification
      .newTripRequest(request, user, res, 'custom client error message');
    expect(response.Notification).to.be.undefined;
  });
  it('should return 400 status code and the error '
    + 'message when "clientError" method is called', () => {
    const response = HelperMethods.requestSuccessful(
      res, { message: 'custom client error message' }
    );
    expect(response.data).to.have.property('message');
    expect(response.data.message).to.equal('custom client error message');
  });
});
