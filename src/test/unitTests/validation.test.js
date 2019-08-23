import chai from 'chai';
import { isEmpty } from '../../validation/validate';

const { expect } = chai;

describe('Test for validation methods', () => {
  it('should return true for empty parameter', done => {
    expect(isEmpty('')).to.equal(true);
    done();
  });
});
