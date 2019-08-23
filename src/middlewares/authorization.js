// eslint-disable-next-line import/no-unresolved
import verifyToken from '../utils/Authentication';

const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token']
    || req.query.token
    || req.headers.authorization;
  if (token) {
    const response = verifyToken(token);
    if (response.success) {
      return next();
    }
    return {
      success: false,
      error: 'Token is invalid.'
    };
  }
  return res.status(401).json({
    status: 401,
    success: false,
    error: 'Unauthorized! no token provided.'
  });
};

export default checkToken;
