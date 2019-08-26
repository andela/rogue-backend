import chai from 'chai';
import { Authentication } from '../../utils';

const { expect } = chai;

const data = {
  id: 'ec0d84a1-4195-4a98-b46c-5976e1839a06',
  role: 1,
  username: 'john134'
};

describe('Tests for authentication helper methods', () => {
  it('should generate a shuffled token', async () => {
    const token = await Authentication.getToken(data);
    expect(token).to.be.a('string');
  });

  it('it should unscramble token and validate', async () => {
    const token = await Authentication.getToken(data);
    const responsePayload = await Authentication.verifyToken(token);
    expect(responsePayload.id).to.be.equal('ec0d84a1-4195-4a98-b46c-5976e1839a06');
    expect(responsePayload.role).to.be.equal(1);
    expect(responsePayload.username).to.be.equal('john134');
    expect(responsePayload).to.be.a('object');
  });

  it('should return a response of success false if the token is invalid', async () => {
    const invalidToken = await Authentication.verifyToken('wer#rergfdfgt454rFEF%$Ff3fw');
    expect(invalidToken).to.be.an('object');
    expect(invalidToken).to.haveOwnProperty('success');
    expect(invalidToken.success).to.be.equal(false);
  });
});
