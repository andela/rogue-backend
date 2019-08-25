import db from '../models';
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

export const signUp = async (req, res) => {
  try {
    const user = await db.User.create(req.body);
    sendSuccess(res, user, 201);
  } catch (err) {
    sendError(res, err);
  }
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
