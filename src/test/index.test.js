import chai from 'chai';
import chaiHttp from 'chai-http';
import { add } from '../utils';

chai.use(chaiHttp);
const { expect } = chai;

describe('simple unit test', () => {
  it('should pass this test', (done) => {
    expect(2).to.equal(2);
    done();
  });

  it('should add two numbers', (done) => {
    expect(add(1, 2)).to.equal(3);
    done();
  });
});
