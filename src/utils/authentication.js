/* eslint-disable arrow-parens */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const shuffleToken = token => token.split('').reverse().join('');

export const generateToken = (payload, expiresIn = '24h') => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  return shuffleToken(token);
};

export const verifyToken = (token) => {
  const initialToken = shuffleToken(token);
  return jwt.verify(initialToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return {
        success: false
      };
    }
    return {
      success: true,
      decodedPayload: decoded
    };
  });
};
