/* eslint-disable require-jsdoc */
import { isEmpty } from '../validation/validate';

class Sanitizer {

  static async signupSanitizer(req, res, next) {
    const {
      firstName, lastName, email, password
    } = req.body;
    const missingFields = [firstName, lastName, email, password].map((field, index) => {
      const keys = {
        0: 'firstName',
        1: 'lastName',
        2: 'email',
        3: 'password',
      };

      return field === undefined ? keys[index] : null; // - returns field that is undefined only;if the field is null or empty the validation on line 28 takes care of it
    }).filter(field => field !== null).join(', ');

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({
        status: 'error',
        error: `you are missing these fields: ${missingFields}`
      });
    }

    const response = msg => res.status(400).send(msg);
    if (isEmpty(firstName)) return response('firstname cannot be empty');
    if (isEmpty(lastName)) return response('lastname cannot be empty');
    if (isEmpty(email)) return response('email cannot be empty');
    if (isEmpty(password)) return response('password cannot be empty');

    return next();
  }
}

export default Sanitizer;