import db from '../models/User';
import { Sequelize, sequelize } from '../models';
import SendEmail from '../utils/HelperMethods';

const Users = db(sequelize, Sequelize.DataTypes);

// eslint-disable-next-line import/prefer-default-export
export const signUp = async (req, res) => {
  try {
    const isVerified = false;

    const {
      email, firstName, lastName, password
    } = req.body;
    const user = await Users.create({
      email,
      firstName,
      lastName,
      password,
      isVerified,
    });
    const url = 'localhost:3000/;';
    SendEmail(email, firstName, url);
    res.status(201).json({
      success: true,
      message: 'Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.',
      data: user
    });
  } catch (err) {
    const status = 400;
    const error = err.errors[0].message;
    res.status(status).json({ status, error });
  }
};

