import dotenv from 'dotenv';
import models from '../models';
import { HelperMethods, Authentication, SendEmail } from '../utils';

const { User } = models;

dotenv.config();

/**
 * Class representing the social authentication controller
 * @class UserController
 * @description users controller
 */
class SocialController {
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
   * Check if a user already exists via finding-by-email
   * @param {string} email - user's email
   * @return {object} - user details found
   * @memberof SocialController
   */
  static async findByEmail(email) {
    const userData = await User.findOne({ where: { email, } });
    return userData;
  }

  /**
   * Log in user via google
   * Route: POST: /auth/google
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof socialController
   */
  static async googleLogin(req, res) {
    // check if user exist
    try {
      const [{ value: userEmail }] = req.user.emails;
      if (!userEmail) {
        return HelperMethods.clientError(
          res, 'No email address is found for this user', 400
        );
      }
      const userData = await SocialController.findByEmail(userEmail);
      if (!userData) {
        return HelperMethods.clientError(
          res, 'You are not a registered user. Please, signup', 404
        );
      }
      if (!userData.isVerified) {
        const isEmailSent = await
        SocialController.createTokenAndSendEmail(userData.dataValues);
        if (isEmailSent) {
          return HelperMethods.clientError(
            res, 'You had started the registration process earlier. '
            + 'Please check your email to complete your registration.',
            400
          );
        }
        return HelperMethods.clientError(
          res, 'You are not a verified user. Please verify your email and try again',
          400
        );
      }
      const token = await Authentication.getToken({
        id: userData.id,
        username: userData.username,
        role: userData.role
      });
      delete userData.password;
      return HelperMethods.requestSuccessful(res, {
        message: 'Log in successful',
        token,
        userData,
      }, 200);
    } catch (error) {
      HelperMethods.serverError(res, 'Something failed');
    }
  }

  /**
   * Login user via facebook
   * Route: POST: /auth/facebook
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof SocialController
   */
  static async facebookLogin(req, res) {
    try {
      const [{ value: userEmail }] = req.user.emails;
      if (!userEmail) {
        return HelperMethods.clientError(res,
          'No email address is found for this user',
          400);
      }
      const userData = await SocialController.findByEmail(userEmail);
      if (!userData) {
        return HelperMethods.clientError(res,
          'You are not a registered user. Please, signup',
          404);
      }
      if (!userData.isVerified) {
        const isEmailSent = await
        SocialController.createTokenAndSendEmail(userData.dataValues);
        if (isEmailSent) {
          return HelperMethods.clientError(
            res, 'You had started the registration process earlier. '
            + 'Please check your email to complete your registration.',
            400
          );
        }
        return HelperMethods.clientError(
          res, 'You are not a verified user. Please verify your email and try again',
          400
        );
      }
      const token = await Authentication.getToken({
        id: userData.id,
        username: userData.username,
        role: userData.role
      });
      delete userData.password;
      return HelperMethods.requestSuccessful(res, {
        message: 'Log in successful',
        token,
        userData,
      }, 200);
    } catch (error) {
      HelperMethods.serverError(res, 'Something failed');
    }
  }
}

export default SocialController;
