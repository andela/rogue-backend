import models from '../models';
import { HelperMethods } from '../utils';

const { Room } = models;

/**
 * Class representing the Accomodation controller
 * @class AccommodationController
 * @description accommodation controller
 */
class AccommodationController {
  /**
  * Book An  Accommodation.
  * Route: POST: /accommodation
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof AccommodationController
 */
  static async bookAnAccommodation(req, res) {
    try {
      const { body } = req;
      const { dataValues } = await Room.create({ ...body });
      if (dataValues.id) {
        HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Accommodation booked successfully',
          accommodationCreated: dataValues,
        }, 201);
      }
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default AccommodationController;
