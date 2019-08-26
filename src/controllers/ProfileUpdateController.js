/* eslint-disable linebreak-style */
import bcrypt from 'bcrypt';
import { sequelize, Sequelize } from '../models/index';
import userModel from '../models/User';
import { returnDate } from '../utils/helper';
import { generateToken } from '../utils/authentication';
import ResponseHandler from '../utils/ResponseHandler';

const Users = userModel(sequelize, Sequelize.DataTypes);
/**
 * @description Contains all profile update functionalities
 * @export
 * @class ProfileController
 */
export default class ProfileController {
  /**
   *
   * @description method that creates a new test user
   * @static
   * @param {object} req client request
   * @param {object} res server response
   * @returns {object} server response object
   * @memberof ProfileController
   */
  static async create(req, res) {
    const timeStamp = Date.now().toString();
    const id = Math.round(parseInt(timeStamp, 10) / 1000);
    req.body.id = id;
    const { firstName, lastName, email } = req.body;
    const token = generateToken({
      firstName,
      lastName,
      email,
      id
    });
    try {
      const user = await Users.create(req.body);
      const data = {
        id,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        token
      };
      ResponseHandler.success(res, data, 201);
    } catch (error) {
      ResponseHandler.error(res, error);
    }
  }

  /**
   *
   * @description method that signs in a use;
   * @static
   * @param {object} req client request
   * @param {object} res server response
   *  @param {object} next next middleware
   * @returns {object} server response object
   * @memberof ProfileController
   */
  static async signInUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({ where: { email } });
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        ResponseHandler.success(res, user, 200);
      }
      ResponseHandler.error(res, 'login details do not match', 401);
    } catch (error) {
      ResponseHandler.error(res, error, 404);
    }
  }

  /**
   *
   * @description method that updates user's profile settings
   * @static
   * @param {object} req client request
   * @param {object} res server response
   * @returns {object} server response object
   * @memberof ProfileController
   */
  static async updateProfile(req, res) {
    const userId = parseInt(req.params.id, 10);
    try {
      const user = await Users.findOne({ where: { id: userId } });
      try {
        const oldDate = user.birthdate;
        await user.update({
          firstName: req.body.firstName || user.firstName,
          lastName: req.body.lastName || user.lastName,
          password: req.body.password || user.password,
          gender: req.body.gender || user.gender,
          birthdate: returnDate(req.body.birthdate, oldDate),
          preferredLanguage:
            req.body.preferredLanguage || user.preferredLanguage,
          preferredCurrency:
            req.body.preferredCurrency || user.preferredCurrency,
          city: req.body.city || user.city,
          state: req.body.state || user.state,
          zip: req.body.zip || user.zip,
          country: req.body.country || user.country,
          role: req.body.role || user.role,
          department: req.body.department || user.department,
          lineManager: req.body.lineManager || user.lineManager
        });
      } catch (error) {
        ResponseHandler.error(res, 'error', 400);
      }
      ResponseHandler.success(res, user);
      return res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      ResponseHandler.error(res, 'no user with that id was found', 404);
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
    const userId = parseInt(req.params.id, 10);
    try {
      const user = await Users.findOne({ where: { id: userId } });
      ResponseHandler.success(res, user);
    } catch (error) {
      ResponseHandler.error(res, 'No user with that id was found', 404);
    }
  }
}
