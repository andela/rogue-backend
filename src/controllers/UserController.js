import models from '../models';
import { Authentication, SendEmail, HelperMethods } from '../utils';

const { User } = models;

/**
 * Class representing the user controller
 * @class UserController
 * @description users controller
 */
class UserController {
  /**
   * This method creates a temporary token and then
   * sends an email to the user.
   * @param {object} userExist - An object containing details of the
   * user we want to send an email to.
   * @returns {boolean} isEmailSent - Tells if email was actually sent
   */
  static async createTokenAndSendEmail(userExist) {
    const tokenCreated = await Authentication.getToken(userExist, '1h');
    if (tokenCreated) {
      const isEmailSent = await
      SendEmail.verifyEmail(userExist.email, userExist.firstName, tokenCreated);
      return isEmailSent;
    }
  }

  /**
   * Login a user
   * Route: POST: /auth/login
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async login(req, res) {
    try {
      const {
        email,
        password
      } = req.body;
      const userFound = await User.findOne({
        where: {
          email
        }
      });
      if (!userFound) {
        return HelperMethods.clientError(res, 'Email or password does not exist', 400);
      }
      if (!userFound.dataValues.isVerified) {
        return HelperMethods.clientError(res, {
          success: false,
          message: 'You had started the registration process already. '
            + 'Please check your email to complete your registration.'
        }, 400);
      }
      const isPasswordValid = await userFound.verifyPassword(password);
      if (userFound.dataValues && isPasswordValid) {
        const tokenCreated = await Authentication.getToken({
          id: userFound.id,
          username: userFound.username,
          role: userFound.role,
        });
        if (tokenCreated) {
          const userDetails = {
            id: userFound.dataValues.id,
            username: userFound.dataValues.username,
            role: userFound.dataValues.role,
            token: tokenCreated,
          };
          return HelperMethods.requestSuccessful(res, {
            success: true,
            message: 'Login successful',
            userDetails,
          }, 200);
        }
        return HelperMethods.serverError(res);
      }
      return HelperMethods.clientError(res, 'Email or password does not exist', 400);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Sign up a user
   * Route: POST: /auth/signup
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async signUp(req, res) {
    const {
      email, firstName, lastName, password, username,
    } = req.body;
    try {
      const userExist = await User.findOne({
        where: { email }
      });
      if (userExist && userExist.dataValues.id) {
        if (userExist.dataValues.isVerified === false) {
          const isEmailSent = await
          UserController.createTokenAndSendEmail(userExist.dataValues);
          if (isEmailSent) {
            return HelperMethods
              .requestSuccessful(res, {
                message: 'You had started the registration '
                  + 'process earlier. '
                  + 'An email has been sent to your email address. '
                  + 'Please check your email to complete your registration.'
              }, 200);
          }
          return HelperMethods
            .serverError(res, 'Your registration could not be completed.'
              + ' Please try again');
        }
        if (userExist.dataValues.isVerified === true) {
          return HelperMethods
            .requestSuccessful(res, {
              message: 'You are a registered user on '
                + 'this platform. Please proceed to login'
            }, 200);
        }
      }
      const userCreated = await User.create({
        email,
        firstName,
        lastName,
        password,
        username,
      });
      if (userCreated && userCreated.dataValues.id) {
        const isEmailSent = await
        UserController.createTokenAndSendEmail(userCreated.dataValues);
        if (isEmailSent) {
          return HelperMethods
            .requestSuccessful(res, {
              success: true,
              message: 'An email has been sent to your '
                + 'email address. Please check your email to complete '
                + 'your registration'
            }, 200);
        }
        return HelperMethods
          .serverError(res, 'Your registration could not be completed.'
            + 'Please try again');
      }
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
   *
   * @description method that updates user's profile
   * @static
   * @param {object} req HTTP Request object
   * @param {object} res HTTP Response object
   * @returns {object} HTTP Response object
   * @memberof ProfileController
   */
  static async updateProfile(req, res) {
    try {
      const userExist = await User.findByPk(req.body.id);
      if (userExist && userExist.dataValues.id) {
        if (userExist.dataValues.isVerified === false) {
          return HelperMethods.clientError(
            res, 'You cannot perform this action. You are not a verified user.', 400
          );
        }
        await userExist.update(req.body, {
          returning: true,
          hooks: false
        });
        return HelperMethods
          .requestSuccessful(res, {
            success: true,
            message: 'profile updated successfully',
          }, 200);
      }
      return HelperMethods.clientError(res, 'User does not exist', 404);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
   *
   * @description method that gets current user's settings
   * @static
   * @param {object} req client request
   * @param {object} res server response
   * @returns {object} server response object
   * @memberof ProfileController
   */
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.decoded.id, {
        attributes: {
          exclude: ['password', 'isVerified']
        }
      });
      if (user) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          userDetails: user,
        }, 200);
      }
      return HelperMethods.clientError(res, 'User not found', 404);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Verify a user's email
   * Route: POST: /auth/verify_email
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async verifyEmail(req, res) {
    try {
      const foundUser = await User.findByPk(req.decoded.id);
      if (foundUser.dataValues.id) {
        const userUpdated = await foundUser.update({
          isVerified: true || foundUser.isVerified,
        }, {
          hooks: false
        });
        if (userUpdated.dataValues.id) {
          const isEmailSent = await
          SendEmail.confirmRegistrationComplete(userUpdated.dataValues.email);
          if (isEmailSent) {
            const tokenCreated = await Authentication.getToken(userUpdated.dataValues);
            return res.status(201).json({
              success: true,
              message: `User ${userUpdated.username} created successfully`,
              id: userUpdated.id,
              username: userUpdated.username,
              token: tokenCreated,
            });
          }
        }
      }
      return HelperMethods
        .serverError(res, 'Could not complete your registration. '
          + 'Please re-register.');
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Verify a user's email
   * Route: POST: /update_user
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async updateUserRole(req, res) {
    const payload = req.decoded;
    const {
      role,
      email
    } = req.body;
    try {
      if (payload.role !== 'Super Administrator') {
        return HelperMethods.clientError(res, 'Only a super admin'
          + ' can update user role', 401);
      }
      const userToUpdate = await models.User.findOne({
        where: {
          email
        }
      });
      if (!userToUpdate) {
        return HelperMethods.clientError(res,
          'User not found', 404);
      }
      if (userToUpdate.role === role) {
        return HelperMethods.clientError(res, `user is already a ${role}`, 409);
      }
      await userToUpdate.update({
        role
      });
      return HelperMethods
        .requestSuccessful(res, {
          success: true,
          message: 'Role updated successfully',
        }, 200);
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
  * Sends Emails To Users For Password Reset.
  * Route: POST: /api/v1/reset_password
  * @param {object} req - HTTP Request object
  * @param {object} res - HTTP Response object
  * @param {object} next - HTTP Response object
  * @return {res} res - HTTP Response object
  * @memberof UserController
 */
  static async resetPassword(req, res) {
    try {
      const { email } = req.body;
      const userFound = await User.findOne({ where: { email } });
      if (!userFound) {
        return HelperMethods.clientError(res, 'Invalid user details.', 400);
      }
      if (!userFound.isVerified) {
        return HelperMethods.clientError(res,
          'You are not a verified user. Please verify your email address', 400);
      }
      const emailSent = await SendEmail.resetPassword(email);
      if (emailSent) {
        return HelperMethods.requestSuccessful(res, {
          success: true,
          message: 'An email has been sent to your email '
          + 'address that explains how to reset your password'
        }, 200);
      }
      return HelperMethods.serverError(res,
        'Could not send reset instructions to your email. Please, try again');
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }

  /**
   * Update rememberDetails column of a user
   * Route: POST: api/v1/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof UserController
   */
  static async rememberUserDetails(req, res) {
    try {
      const { id } = req.decoded;
      const { rememberDetails } = req.body;
      const [, [update]] = await User.update({ rememberDetails }, {
        where: { id },
        returning: true
      });

      if (!update) {
        return HelperMethods.clientError(
          res, {
            success: false,
            message: 'User not found'
          }, 404
        );
      }

      return HelperMethods.requestSuccessful(
        res, {
          success: true,
          message: 'Update successful',
          rememberDetails: update.get().rememberDetails
        }, 200
      );
    } catch (error) {
      if (error.errors) return HelperMethods.sequelizeValidationError(res, error);
      return HelperMethods.serverError(res);
    }
  }
}

export default UserController;
