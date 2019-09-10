import models from '../models';
import { HelperMethods } from '../utils';

const { Sequelize, Like, Accommodation } = models;

/**
 * Class representing the accommodation controller
 * @class AccommodationController
 * @description accommodation controller
 */
class AccommodationController {
  /**
   * Update user to like/unlike accommodation
   * Route: POST: api/v1/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async likeAccommodation(req, res) {
    try {
      const { id: userId } = req.decoded;
      const { like, accommodationId } = req.body;
      const where = { userId, accommodationId };
      const isAlreadyLiked = await Like.findOne({ where });
      const success = isLiked => HelperMethods.requestSuccessful(
        res,
        {
          success: true,
          message: 'Update successful',
          like: isLiked
        },
        200
      );

      if (isAlreadyLiked && like) return success(true);
      if (!isAlreadyLiked && !like) return success(false);
      if (like) {
        await Like.create({ ...where });
        return success(true);
      }

      if (!like) {
        await Like.destroy({ where });
        return success(false);
      }
    } catch (error) {
      if (error instanceof Sequelize.ForeignKeyConstraintError) {
        return HelperMethods.clientError(res, 'Accommodation does not exist', 404);
      }

      if (error instanceof Sequelize.DatabaseError) {
        return HelperMethods.clientError(res, '"accommodationId" field is invalid', 400);
      }

      return HelperMethods.serverError(res);
    }
  }

  /**
   * Create a Accommodation Facility
   * Route: POST: /Accommodation
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof AccommodationController
   */
  static async createAccommodation(req, res) {
    try {
      const { dataValues } = await Accommodation.create({ ...req.body });
      if (dataValues.id) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Accommodation created successfully',
          data: dataValues,
        }, 201);
      }
      return HelperMethods.serverError(res,
        'Could not create an accommodation. Please try again');
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res, 'Something failed');
    }
  }

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
