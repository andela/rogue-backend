import models from '../models';
import { HelperMethods } from '../utils';

const { Request, User } = models;

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

  static async editRequest(req, res) {
    try {
      const { id } = req.decoded;
      const {
        body
      } = req;

      const requestExist = await Request.findOne({
        where: {
          id: body.requestId,
          userId: id,
        }
      });
      if (requestExist) {
        if (requestExist.dataValues.status === 'open') {
          if (requestExist.dataValues.returnDate) {
            const convertFlightDate = new Date(body.flightDate).toISOString();
            const convertReturnDate = new Date(body.returnDate).toISOString();
            if (convertFlightDate > convertReturnDate) return HelperMethods.clientError(res, 'The flight date cannot be after the return date', 400);
          }

          const updatedRequest = await requestExist.update({
            ...body,
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
    }
  }

  /**
  * Get pending requests
  * Route: GET: /request
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async getPendingRequests(req, res) {
    try {
      const pendingRequests = await Request.findAll({
        where: { status: 'open' },
        include: [{
          model: User,
          where: {
            lineManager: req.decoded.id
          },
          attributes: {
            exclude: [
              'password',
              'isVerified',
              'profileImage',
              'hasProfile',
              'rememberDetails',
              'createdAt',
              'updatedAt',
              'preferredCurrency',
              'preferredLanguage',
              'birthdate',
              'id'
            ]
          }
        }],
      });
      if (pendingRequests.length) {
        return HelperMethods.requestSuccessful(res,
          { success: true, pendingRequests, }, 200);
      }
      return HelperMethods.clientError(res, 'There are no pending requests', 404);
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Approve pending requests
  * Route: PATCH: /request
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async approveRequest(req, res) {
    try {
      const pendingRequest = await Request.findOne({
        where: {
          id: req.body.id,
          status: 'open',
        },
      });
      if (pendingRequest) {
        const requestApproved = await pendingRequest.update({
          status: 'approved' || pendingRequest.status,
        }, { hooks: false });
        if (requestApproved.dataValues.id) {
          return HelperMethods
            .requestSuccessful(res, {
              success: true,
              message: 'Request approved successfully',
            }, 200);
        }
      }
      return HelperMethods.clientError(res,
        'No pending request found or request has been previously approved', 404);
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }
}

export default RequestController;
