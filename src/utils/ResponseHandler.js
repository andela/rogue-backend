/* eslint-disable no-unused-vars */

/**
 *
 *
 * @export
 * @class ResponseHandler
 */
export default class ResponseHandler {
  /**
   *
   *
   * @static
   * @param {*} res HTTP response object
   * @param {*} data An object or array to send as a response
   * @param {number} [status=200] HTTP response status code. Default is 200
   * @memberof ResponseHandler
   * @returns {void}
   */
  static success(res, data, status = 200) {
    res.status(status).json({
      success: true,
      status,
      data
    });
  }

  /**
   *
   *
   * @static
   * @param {*} res HTTP response object
   * @param {string} [message='Bad request'] An error message
   * @param {number} [status=400] HTTP response status code. Default is 400
   * @memberof ResponseHandler
   * @returns {void}
   */
  static error(res, message = 'Bad request', status = 400) {
    res.status(status).json({
      success: false,
      status,
      error: message
    });
  }
}
