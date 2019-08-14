import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const { expect } = chai;

describe('simple unit test' , () => {
	it('should pass this test', (done) => {
  expect(2).to.equal(2);
  done();
	});
});


