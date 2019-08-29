// import models from '../models';

// const { User } = models;
/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim - request body to trim
 * @returns {object} trimmedValues - trimmed values of the request object
 */
const trimValues = objectWithValuesToTrim => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach(key => {
    trimmedValues[key] = trimmedValues[key].length
      ? trimmedValues[key].trim() : trimmedValues[key];
  });
  return trimmedValues;
};

/**
 * Defines the failed message returned when required fields are missing.
 * @param {object} res - Response object
 * @param {string} message - specific error message
 * @returns {res} - Response object
 */
const allFieldsRequired = (res, message) => {
  res.status(400).send({
    success: false,
    message: message || 'Invalid request. All fields are required',
  });
};

/**
 * class representing an handler's validation
 * @class Validate
 * @description Validation for user inputs in all requests
*/
class Validate {
  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateUserInput(req, res, next) {
    req.body = trimValues(req.body);
    next();
  }

  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateUserLogin(req, res, next) {
    req.body = trimValues(req.body);
    const { password, email } = req.body;
    if (!password) return allFieldsRequired(res);
    if (!email) return allFieldsRequired(res);
    next();
  }

  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateUserEmail(req, res, next) {
    req.body = trimValues(req.body);
    const { email } = req.body;
    if (!email) return allFieldsRequired(res);
  static validateRoleUpdate(req, res, next) {
    req.body = trimValues(req.body);
    const { email, role } = req.body;
    if (!email) return allFieldsRequired(res);
    if (!role) return allFieldsRequired(res);
    next();
  }
}

export default Validate;

