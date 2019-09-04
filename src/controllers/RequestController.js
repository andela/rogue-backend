/* eslint-disable import/no-cycle */
import models from '../models';
import { HelperMethods, SendEmail, Notification } from '../utils';

const {
  Request, User, Message, Sequelize: { Op }
} = models;

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
      const { dataValues } = await Request.create({ ...body, userId: id, });
      if (dataValues.id) {
        const user = await User.findByPk(id);
        if (user.dataValues) {
          const manager = await User.findByPk(user.lineManager);
          if (manager.dataValues && manager.isSubscribed) {
            const isEmailSent = await SendEmail.sendEmailNotification({
              user, manager, dataValues, type: 'one-way trip',
            });
            const isNotified = await Notification.newTripRequest(req, user);
            if (isEmailSent && isNotified) {
              await Message.create({
                userId: id,
                message: `${user.username} created a new travel request`,
                lineManager: user.dataValues.lineManager,
                type: 'creation'
              });
            }
          }
        }
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Trip booked successfully',
          tripCreated: dataValues,
        }, 201);
      }
      return HelperMethods.serverError(res,
        'Could not create a one-way trip. Please, try again');
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
        const user = await User.findByPk(id);
        if (user.dataValues) {
          const manager = await User.findByPk(user.lineManager);
          if (manager.dataValues && manager.isSubscribed) {
            const isEmailSent = await SendEmail.sendEmailNotification({
              user, manager, dataValues, type: 'return trip'
            });
            const isNotified = await Notification.newTripRequest(req, user);
            if (isEmailSent && isNotified) {
              await Message.create({
                message: `${user.username} created a new travel request`,
                userId: id,
                lineManager: user.dataValues.lineManager,
                type: 'creation'
              });
            }
          }
        }
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Return-trip booked successfully',
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
  * Edit a request
  * Route: PATCH: /request/edit
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
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
            const convertFlightDate = body.flightDate
              ? new Date(body.flightDate).toISOString() : requestExist.flightDate;
            const convertReturnDate = body.returnDate
              ? new Date(body.returnDate).toISOString() : requestExist.returnDate;
            if (convertFlightDate > convertReturnDate) {
              return HelperMethods.clientError(
                res, 'The flight date cannot be after the return date', 400
              );
            }
          }

          const updatedRequest = await requestExist.update({ ...body, });
          if (updatedRequest) {
            const user = await User.findByPk(id);
            if (user) {
              const manager = await User.findByPk(user.lineManager);
              if (manager && manager.isSubscribed) {
                const isNotified = await Notification.editTripRequest(req, user);
                if (isNotified) {
                  await Message.create({
                    message: `${user.username} edited a travel request`,
                    userId: id,
                    lineManager: user.dataValues.lineManager,
                    type: 'edition'
                  });
                }
              }
            }
            return HelperMethods.requestSuccessful(res, {
              success: true,
              message: 'Trip updated successfully',
              updatedData: updatedRequest.dataValues,
            }, 200);
          }
        }
        return HelperMethods.clientError(res, 'Forbidden', 403);
      }
      return HelperMethods.clientError(
        res, 'The request you are trying to edit does not exist', 404
      );
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
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
      if ((requestExist.dataValues.status === 'open'
      || requestExist.dataValues.status === 'approved') && requestExist.dataValues.id) {
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
        returnTrip: true,
        multiDestination: [...destination],
        multiflightDate: [...flightDate],
      });
      if (dataValues.id) {
        const user = await User.findByPk(id);
        if (user.dataValues) {
          const manager = await User.findByPk(user.lineManager);
          if (manager.dataValues.id && manager.isSubscribed) {
            const isEmailSent = await SendEmail.sendEmailNotification({
              user, manager, dataValues, type: 'multi-city trip'
            });
            const isNotified = await Notification.newTripRequest(req, user);
            if (isEmailSent && isNotified) {
              await Message.create({
                message: `${user.username} created a new travel request`,
                userId: id,
                lineManager: user.dataValues.lineManager,
                type: 'creation'
              });
            }
          }
        }
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Multi-city trip booked successfully',
          tripBooked: dataValues,
        }, 201);
      }
      return HelperMethods.serverError(res,
        'Could not create a multi-city trip. Please, try again');
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Search Requests
  * Route: GET: /request/search
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async searchRequests(req, res) {
    try {
      const {
        destination,
        flightDate,
        multiDestination,
        multiflightDate,
        ...withoutDestinationAndFlightDate
      } = req.query;

      let search = { ...withoutDestinationAndFlightDate };
      const queryDestination = {
        [Op.or]: [
          { destination },
          { multiDestination: { [Op.contains]: [destination] } }
        ]
      };

      const queryFlightDate = {
        [Op.or]: [
          { flightDate },
          { multiflightDate: { [Op.contains]: [flightDate] } }
        ]
      };

      const queryMultiDestination = {
        multiDestination: { [Op.contains]: multiDestination }
      };

      const queryMultiFlightDate = {
        multiflightDate: { [Op.contains]: multiflightDate }
      };

      if (destination) search = { ...search, ...queryDestination };
      if (flightDate) search = { ...search, ...queryFlightDate };
      if (multiDestination) search = { ...search, ...queryMultiDestination };
      if (multiflightDate) search = { ...search, ...queryMultiFlightDate };

      const requests = await Request.findAll({ where: search });
      HelperMethods.requestSuccessful(
        res,
        {
          success: true,
          message: 'Search successful',
          searchResults: requests.map(request => request.get())
        },
        200
      );
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Confirm an approved request
  * Route: PATCH: /request/reject
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof RequestController
  */
  static async confirmRequestApproval(req, res) {
    try {
      const approvedRequest = await Request.findOne({
        where: { id: req.body.id },
      });
      if (approvedRequest) {
        if (approvedRequest.status === 'confirmed') {
          return HelperMethods.clientError(res,
            'This request has already been confirmed', 404);
        }
        const requestConfirmed = await approvedRequest.update(
          { status: 'confirmed' }, { hooks: false }
        );
        if (requestConfirmed.dataValues.id) {
          return HelperMethods
            .requestSuccessful(res, {
              success: true,
              message: 'Request confirmed successfully',
            }, 200);
        }
        return HelperMethods.clientError(res,
          'Could not confirm the request. Please try again', 400);
      }
      return HelperMethods.clientError(res,
        'The request you are trying to confirm cannot be found', 404);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default RequestController;
