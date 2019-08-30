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

  static async editARequest(req, res) {
    try {
      const { id } = req.decoded;
      const {
        requestId, origin, destination, flightDate, returnDate, reason,
      } = req.body;

      const requestExist = await Request.findOne({
        where: {
          id: requestId,
          userId: id,
        }
      });
      if (requestExist) {
        if (requestExist.dataValues.status === 'pending') {
          if (requestExist.dataValues.returnDate) {
            const convertFlightDate = new Date(flightDate).toISOString();
            const convertReturnDate = new Date(returnDate).toISOString();
            if (convertFlightDate > convertReturnDate) return HelperMethods.clientError(res, 'Invalid Date Parameters', 400);
          }

          const updatedRequest = await requestExist.update({
            origin, destination, flightDate, returnDate, reason
          });
          return HelperMethods.requestSuccessful(res, {
            success: true,
            message: 'Trip udpdated successfully',
            updatedData: updatedRequest.dataValues,
          }, 200);
        }
        return HelperMethods.clientError(res, 'Forbidden', 403);
      }
      return HelperMethods.clientError(res, 'Request not found', 404);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default RequestController;
