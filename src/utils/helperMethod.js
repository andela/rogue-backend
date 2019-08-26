/**
 * Class representing the helper methods
 * @class HelperMethods
 * @description methods used everywhere in the codebase
 */
class HelperMethods {
  /**
   * A method used to send server errors
   * @param {object} res - HTTP response object
   * @param {String} message - The error message you want to set.
   * @returns {object} res - The HTTP response object
   */
  static serverError(res, message) {
    return res.status(500).json({
      success: false,
      message: message || 'Internal server error',
    });
  }

  /**
   * A method used to send client-side errors
   * @param {object} res - HTTP response object
   * @param {String} message - The error message you want to set.
   * @param {number} status = Status code of the client error
   * @returns {object} res - The HTTP response object
   */
  static clientError(res, message, status = 400) {
    return res.status(status).json({
      success: false,
      message,
    });
  }

  /**
   * A method used to confirm that a request was successful
   * @param {object} res - HTTP response object
   * @param {object} payload - data we want to send to the front-end
   * @param {number} status = Status code of the successful request
   * @returns {object} res - HTTP response object
   */
  static requestSuccessful(res, payload, status = 200) {
    return res.status(status).json({ data: { ...payload } });
  }

  /* eslint-enable no-useless-escape */
  /**
   * @param {object} err - error object
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static checkExpressErrors(err, req, res, next) {
    res.status(500).json({
      message: 'Something failed',
      success: false
    });
    next();
  }

  /**
   * A method used to send sequelize validation error
   * @param {object} res - HTTP response object
   * @param {object} error - The error object from sequelize.
   * @returns {object} res - The HTTP response object
   */
  static sequelizeValidationError(res, error) {
    if (error.errors[0].type === 'notNull Violation') {
      res.status(400).json({
        success: false,
        message: `The "${error.errors[0].path}" field is required`,
      });
    }
  }
}

export default HelperMethods;
