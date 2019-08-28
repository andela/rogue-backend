import models from '../models';
import { HelperMethods } from '../utils';

const { Request, Destination } = models;

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
      const {
        // eslint-disable-next-line camelcase
        origin, returnDate, return_trip, destination, flightDate
      } = body;
      const { dataValues } = await Request.create({
        origin, returnDate, return_trip, userId: id
      });
      await Destination.create({ destination, flightDate, requestId: dataValues.id });
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

  /**
  * Book a Return Trip
  * Route: POST: /request
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async bookAReturnTrip(req, res) {
    try {
      const { id } = req.decoded;
      const { returnDate } = req.body;
      if (!returnDate) {
        return HelperMethods.clientError(res, 'The returnDate field is required.');
      }
      const { dataValues } = await Request.create({ ...req.body, userId: id });
      if (dataValues.id) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Trip booked successfully',
          tripCreated: dataValues,
        }, 201);
      }
      return HelperMethods.clientError(res,
        'Could not book your return trip. please try again.',
        400);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Book a Trip
  * Route: POST: /request/multicity
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
 */
  static async bookMulticity(req, res) {
    try {
      const { id } = req.decoded;
      const { body } = req;
      const {
        // eslint-disable-next-line camelcase
        origin, returnDate, return_trip, destination, flightDate
      } = body;
      const { dataValues } = await Request.create({
        origin, returnDate, return_trip, userId: id
      });
      await Destination.create({
        multiDestination: destination,
        multiflightDate: flightDate,
        requestId: dataValues.id
      });
      if (dataValues.id) {
        HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Trip booked successfully',
        }, 201);
      }
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default RequestController;
