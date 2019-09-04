import { io } from '../index';

/**
 * Class representing the helper methods
 * @class HelperMethods
 * @description methods used everywhere in the codebase
 */
export default class Sockets {
  /**
  * A method used to send server errors
  * @param {object} event - HTTP response object
  * @param {String} message - The error message you want to set.
  * @returns {object} res - The HTTP response object
  */
  static emiter(event, message) {
    return io.emit(event, message);
  }
}
