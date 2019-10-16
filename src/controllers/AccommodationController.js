import models from '../models';
import { HelperMethods } from '../utils';

const {
  Sequelize, Like, Accommodation, Comment
} = models;

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
  * Comment on an Accommodation Facility
  * Route: POST: /Accommodation
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof AccommodationController
  */
  static async commentOnAccommodation(req, res) {
    const { comment, accommodationFacility } = req.body;
    const { username, id: userId, profileImage } = req.decoded;
    try {
      const where = {
        userId, username, profileImage, comment, accommodationFacility
      };
      const isCreated = await Comment.create({ ...where });
      if (isCreated) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'Comment created successfully',
          data: isCreated
        });
      }
      return HelperMethods.serverError(res,
        'Could not create comment. Please try again');
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res, 'Something failed');
    }
  }
}

export default AccommodationController;
