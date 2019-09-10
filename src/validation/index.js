import moment from 'moment';
import { HelperMethods } from '../utils';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim - request body to trim
 * @returns {object} trimmedValues - trimmed values of the request object
 */
const trimValues = objectWithValuesToTrim => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach(key => {
    trimmedValues[key] = trimmedValues[key].length
      ? trimmedValues[key].trim()
      : trimmedValues[key];
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
    message: `Invalid request. '${message}' field is required`
  });
};

/**
 * Defines the failed message returned when required fields are missing.
 * @param {object} requestBody - HTTP request object
 * @returns {string} - Property of the request body object that is empty.
 */
const checkForEmptyFields = requestBody => {
  let result;
  Object.keys(requestBody).forEach(key => {
    if (!requestBody[key].length) result = key;
  });
  return result;
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
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
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
    const { email, password } = req.body;
    if (!email) return allFieldsRequired(res, 'email');
    if (!password) return allFieldsRequired(res, 'password');
    next();
  }

  /**
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {callback} next - The callback that passes the request to the next handler
 * @returns {object} res - Response object when query is invalid
 * @memberof Validate
 */
  static validateBookTrip(req, res, next) {
    req.body = trimValues(req.body);
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    const { origin, destination, flightDate } = req.body;
    if (!origin) return allFieldsRequired(res, 'origin');
    if (!destination) return allFieldsRequired(res, 'destination');
    if (!flightDate) return allFieldsRequired(res, 'flightDate');
    next();
  }

  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static async validateReturnDate(req, res, next) {
    const { returnDate } = req.body;
    if (!returnDate) {
      return HelperMethods.clientError(res, 'The returnDate field is required.');
    }
    next();
  }

  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateFlightDateFormat(req, res, next) {
    req.body = trimValues(req.body);
    const { flightDate } = req.body;
    if (flightDate === null || !moment(flightDate).isValid()) {
      return HelperMethods.clientError(res, 'Invalid date format');
    }
    next();
  }

  /**
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateReturnDateFormat(req, res, next) {
    req.body = trimValues(req.body);
    const { returnDate } = req.body;
    if (returnDate === null || !moment(returnDate).isValid()) {
      return HelperMethods.clientError(res, 'Invalid date format');
    }
    next();
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateRoleUpdate(req, res, next) {
    req.body = trimValues(req.body);
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    next();
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateUpdateProfile(req, res, next) {
    req.body = trimValues(req.body);
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    next();
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateRememberDetailsUpdate(req, res, next) {
    req.body = trimValues(req.body);
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    const { rememberDetails } = req.body;
    if (rememberDetails !== 'true' && rememberDetails !== 'false') {
      return res.status(400).send({
        success: false,
        message: '"rememberDetails" field is required and must be a boolean'
      });
    }
    next();
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateMulticity(req, res, next) {
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    if (!req.body.origin) return allFieldsRequired(res, 'origin');
    const { destination, flightDate } = req.body;
    if (!destination || !Array.isArray(destination) || !(destination.length > 1)) {
      return res.status(400).json({
        success: false,
        message: 'Destination has to be more than one'
      });
    }
    if (!flightDate || !Array.isArray(flightDate) || !(flightDate.length > 1)) {
      return res.status(400).json({
        success: false,
        message: 'Please, input flightDate for all destinations'
      });
    }
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
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    if (!req.body.email) return allFieldsRequired(res, 'email');
    next();
  }

  /** @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateSearchRequests(req, res, next) {
    const {
      id,
      origin,
      destination,
      flightDate,
      returnDate,
      reason,
      userId,
      status
    } = req.query;

    const query = {
      id,
      origin,
      destination,
      flightDate,
      returnDate,
      reason,
      userId,
      status
    };

    const validQuery = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value) validQuery[key] = value;
    });

    if (Object.keys(validQuery).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search query.',
      });
    }

    req.query = validQuery;
    next();
  }

  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateConfirmRequest(req, res, next) {
    req.body = trimValues(req.body);
    const emptyField = checkForEmptyFields(req.body);
    if (emptyField) return allFieldsRequired(res, emptyField);
    if (!req.body.id) return allFieldsRequired(res, 'id');
    next();
  }
}
export default Validate;

