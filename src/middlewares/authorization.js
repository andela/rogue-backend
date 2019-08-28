import { Authentication, HelperMethods } from '../utils';

/**
 * Class representing the Authentication methods
 * @class Authorization
 * @description Authenticate protected routes
 */
class Authorization {
  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object containing an error due
   * to invalid token or no token in the request
   */
  static async checkToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.query.token || req.body.token;
    if (!token) return HelperMethods.clientError(res, 'User not authorized', 401);
    const verifiedToken = await Authentication.verifyToken(token);
    if (!verifiedToken.success) {
      return HelperMethods.clientError(res, 'User not authorized', 401);
    }
    req.decoded = verifiedToken;
    next();
  }

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request
   * to the next handler
   * @returns {callback} next - The callback that passes the request
   * to the next handler
   * @returns {object} res - Response object containing an error due
   * to unauthorized user
   */
  static async confirmUser(req, res, next) {
    if (req.decoded.id !== req.params.id) {
      return HelperMethods.clientError(res, {
        success: false,
        message: 'you are not authorized to perform this action'
      }, 400);
    }
    next();
  }
}

export default Authorization;
