import chai from 'chai';
import { HelperMethods } from '../../utils';

const { expect } = chai;

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
    const response = HelperMethods.requestSuccessful(
      res, { message: 'custom client error message' }
    );
    expect(response.data).to.have.property('message');
    expect(response.data.message).to.equal('custom client error message');
  });
});
