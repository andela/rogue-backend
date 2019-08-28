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
      const { dataValues } = await Request.create({
        ...body, userId: id
      });
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
  * Get pending requests
  * Route: GET: /request
  * Book a Trip
  * Route: POST: /request/multicity
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
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Reject a Request
  * Route: PATCH: /request/reject
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async rejectRequest(req, res) {
    try {
      const requestExist = await Request.findByPk(req.body.id);
      if (requestExist.dataValues.status === 'open' && requestExist.dataValues.id) {
        await requestExist.update({ status: 'rejected' });
        return HelperMethods
          .requestSuccessful(res, {
            success: true,
            message: 'You have successfully rejected this request',
          }, 200);
      }
      return HelperMethods.clientError(
        res, 'This request has already been rejected',
        400
      );
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Book a Multicity Trip
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
      const { destination, flightDate, origin } = body;
      const { dataValues } = await Request.create({
        origin,
        userId: id,
        multiDestination: destination,
        multiflightDate: flightDate,
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
