import models from '../models';
import { HelperMethods } from '../utils';

const { Accommodation } = models;

/**
 * Class representing the Accomodation controller
 * @class AccomodationController
 * @description accomodation controller
 */
class AccomodationController {
  /**
   * Create a Accomodation Facilty
   * Route: POST: /accomodation
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof AccomodationController
   */
  static async createAccomodation(req, res) {
    try {
      const { dataValues } = await Accommodation.create({ ...req.body });

      if (dataValues.id) {
        HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Accomodation created successfully',
          data: dataValues,
        }, 201);
      }
    } catch (error) {
      HelperMethods.serverError(res, 'Something failed');
    }
  }
}

export default AccomodationController;
