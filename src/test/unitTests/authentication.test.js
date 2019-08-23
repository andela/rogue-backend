import chai from 'chai';
// eslint-disable-next-line import/no-unresolved
import { shuffleToken, generateToken, verifyToken } from '../../utils/authentication';

const { expect } = chai;

const payload = {
  email: 'johndoe23@gmail.com',
  password: '1234567'
};

describe('Tests for the authentication helper methods', () => {
  describe('should generate a token', () => {
    it('should return a shuffled token', () => {
      const token = generateToken(payload);
      expect(token).to.be.a('string');
      expect(token.split('.').length - 1).to.be.equal(2);
      expect(token.split('.')).to.be.an('array');
      expect(token.split('.').length).to.be.equal(3);
    });
  });

  describe('should shuffle token', () => {
    it('should shuffle the generated token and return it to it\'s original state', () => {
      const token = generateToken(payload);
      const initialToken = shuffleToken(token);
      expect(initialToken).to.be.a('string');
    });
  });

  describe('The token should be shuffled back to it\'s original generated format, and verified', () => {
    it('it should shuffle the token and verify it and return a response of success true if the token is valid', () => {
      const token = generateToken(payload);
      const responsePayload = verifyToken(token);
      expect(token).to.be.a('string');
      expect(responsePayload).to.be.an('object');
      expect(responsePayload).to.haveOwnProperty('success' && 'decodedPayload');
      expect(responsePayload.success).to.be.equal(true);
      expect(responsePayload.decodedPayload).to.be.an('object');
      expect(responsePayload.decodedPayload).to.haveOwnProperty('email');
      expect(responsePayload.decodedPayload).to.haveOwnProperty('password');
      expect(responsePayload.decodedPayload.email).to.be.a('string');
      expect(responsePayload.decodedPayload.password).to.be.a('string');
    });

    it('it should shuffle the token and verify it and return a response of success false if the token is invalid', () => {
      const token = generateToken(payload);
      const invalidToken = shuffleToken(token);
      const responsePayload = verifyToken(invalidToken);
      expect(token).to.be.a('string');
      expect(invalidToken).to.be.a('string');
      expect(responsePayload).to.be.an('object');
      expect(responsePayload).to.haveOwnProperty('success');
      expect(responsePayload.success).to.be.equal(false);
    });
  });
});
