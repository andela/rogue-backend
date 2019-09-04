import sinon from 'sinon';
import chai from 'chai';
import { SearchRequestsMiddleware } from '../../middlewares';

const { expect } = chai;

describe('Unit tests for the SearchRequests Middleware', () => {
  let next;
  afterEach(() => {
    if (next.restore) next.restore();
  });
  it('should change array of destination to multiDestination', async () => {
    const object = { destination: ['Ikeja', 'Agege'] };
    const req = { query: { ...object } };
    next = sinon.spy();
    SearchRequestsMiddleware.setMultiDestinationAndFlightDate(req, null, next);
    sinon.assert.calledOnce(next);
    expect(req.query).not.to.have.property('destination');
    expect(req.query).to.have.property('multiDestination');
    expect(req.query.multiDestination).to.eql(object.destination);
  });
  it('should not change single destination to multiDestination', async () => {
    const object = { destination: 'Agege' };
    const req = { query: { ...object } };
    next = sinon.spy();
    SearchRequestsMiddleware.setMultiDestinationAndFlightDate(req, null, next);
    sinon.assert.calledOnce(next);
    expect(req.query).to.have.property('destination');
    expect(req.query).not.to.have.property('multiDestination');
    expect(req.query.destination).to.eql(object.destination);
  });
  it('should change array of flightDate to multiflightDate', async () => {
    const object = { flightDate: ['2019-07-01', '2019-07-05'] };
    const req = { query: { ...object } };
    next = sinon.spy();
    SearchRequestsMiddleware.setMultiDestinationAndFlightDate(req, null, next);
    sinon.assert.calledOnce(next);
    expect(req.query).not.to.have.property('flightDate');
    expect(req.query).to.have.property('multiflightDate');
    expect(req.query.multiflightDate).to.eql(object.flightDate);
  });
  it('should not change single flightDate to multiflightDate', async () => {
    const object = { flightDate: '2019-07-01' };
    const req = { query: { ...object } };
    next = sinon.spy();
    SearchRequestsMiddleware.setMultiDestinationAndFlightDate(req, null, next);
    sinon.assert.calledOnce(next);
    expect(req.query).to.have.property('flightDate');
    expect(req.query).not.to.have.property('multiflightDate');
    expect(req.query.flightDate).to.eql(object.flightDate);
  });
});
