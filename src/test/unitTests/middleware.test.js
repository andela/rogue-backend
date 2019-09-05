import sinon from 'sinon';
import chai from 'chai';
import { Authorization } from '../../middlewares';
import { Authentication } from '../../utils';

const {
  expect
} = chai;
const req = {
  query: {
    token: () => {}
  },
  body: {
    token: () => {}
  },
  headers: {
    'x-access-token': undefined
  }
};
const res = {};
const next = () => {};

describe('Unit test for the Authorization utility function', () => {
  let stubbedMethod;
  afterEach(() => {
    if (stubbedMethod.restore) stubbedMethod.restore();
  });
  it('should check query params for a token', async () => {
    stubbedMethod = sinon
      .stub(Authentication, 'verifyToken')
      .returns({
        success: true,
        message: 'token found in query'
      });
    await Authorization.checkToken(req, res, next);
    expect(req.decoded.message).to.equal('token found in query');
  });
  it('should check the request body for a token', async () => {
    req.body.token = () => {};
    req.query.token = undefined;
    stubbedMethod = sinon
      .stub(Authentication, 'verifyToken')
      .returns({
        success: true,
        message: 'token found in body'
      });
    await Authorization.checkToken(req, res, next);
    expect(req.decoded.message).to.equal('token found in body');
  });
});
