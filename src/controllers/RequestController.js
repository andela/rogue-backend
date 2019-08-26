import models from '../models';
import { HelperMethods } from '../utils';

const { Request } = models;

/**
 * Class representing the Request controller
 * @class RequestController
 * @description request controller
 */
class RequestController {
  /**
  * Book a Trip
  * Route: POST: /request
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
 */
  static async bookATrip(req, res) {
    try {
      const { id } = req.decoded;
      const { body } = req;
      const { dataValues } = await Request.create({ ...body, userId: id });
      if (dataValues.id) {
        HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Trip booked successfully',
          tripCreated: dataValues,
        }, 201);
      }
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default RequestController;
