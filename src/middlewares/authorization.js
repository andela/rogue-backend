import { verifyToken } from '../utils/authentication';
import ResponseHandler from '../utils/ResponseHandler';

// eslint-disable-next-line import/prefer-default-export
export const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token']
    || req.query.token
    || req.headers.authorization;
  if (token) {
    const { success, decodedPayload } = verifyToken(token);
    if (success) {
      req.user = decodedPayload;
      return next();
    }

    return ResponseHandler.error(res, 'Token is invalid.', 401);
  }

  ResponseHandler.error(res, 'Unauthorized! no token provided.', 401);
};
