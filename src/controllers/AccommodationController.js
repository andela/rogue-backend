import models from '../models';
import { HelperMethods } from '../utils';

const { Accommodation } = models;

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
      const { id } = req.decoded;
      const { dataValues } = await Accommodation.create({ ...body, userId: id });
      if (dataValues.id) {
        HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Accommodation booked successfully',
          accommodationCreated: dataValues,
        }, 201);
      }
      return HelperMethods.serverError(res,
        'Could not create an accommodation. Please try again');
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default AccommodationController;
