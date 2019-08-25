import db from '../models';
import SendEmail from '../utils/HelperMethods';

import { generateToken } from '../utils/authentication';
import ResponseHandler from '../utils/ResponseHandler';

const sendSuccess = (res, { dataValues }, status) => {
  const { id, email } = dataValues;
  const token = generateToken({ id, email });
  ResponseHandler.success(res, { ...dataValues, token }, status);
};

const sendError = (res, err) => {
  const { message } = err.errors ? err.errors[0] : err;
  ResponseHandler.error(res, message);
};

export const signIn = async (req, res) => {
  try {
    const { email = '' } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw Error('User is not registered');
    sendSuccess(res, user, 200);
  } catch (err) {
    sendError(res, err);
  }
};

export const signUp = async (req, res) => {
  try {
    const {
      email, firstName, lastName, password
    } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) throw Error('User is not registered');
    sendSuccess(res, user, 200);
    const isVerified = false;

    const newUserCreated = await db.User.create({
      email,
      firstName,
      lastName,
      password,
      isVerified,
    });

    const url = `${process.env.HOME_PAGE}`;
    SendEmail(email, firstName, url);
    res.status(201).json({
      success: true,
      message: 'Your account has been successfully created. '
      + 'An email has been sent to you with detailed instructions on how to activate it.',
      data: newUserCreated,
    });
  } catch (err) {
    sendError(res, err);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const findUser = await db.User.findOne({
      where: { email: req.query.email }
    });

    if (findUser) {
      if (findUser.isVerified) {
        return res.status(200).json({
          message: 'Your email has been verified.'
        });
      }
      await db.User.update(
        { isVerified: true },
        { where: { id: findUser.id } },
      );
      return res.status(403).json({
        message: `User with ${findUser.firstName} has been verified,`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'internal server error! please try again later'
    });
  }
};
