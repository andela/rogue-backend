/* eslint-disable require-jsdoc */
import bcrypt from 'bcryptjs';
import db from '../models';
import { generateToken } from '../utils/authentication';

// eslint-disable-next-line import/prefer-default-export

class UserControllers {
  // eslint-disable-next-line require-jsdoc
  static async signUpController(req, res) {
    try {
      const {
        password, lastName, firstName, email
      } = req.body;

      const hashedPwd = await bcrypt.hash(password, 10);
      console.log(hashedPwd)
      const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPwd,
      };
      const user = await db.User.create(newUser);
      const payLoad = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const token = await generateToken(payLoad);
      res.status(201).json({ status: 'success', token });
    } catch (err) {
      const status = 400;
      const error = err.errors[0].message;
      res.status(status).json({ status: 'error', error });
    }
  }
}

export default UserControllers;

