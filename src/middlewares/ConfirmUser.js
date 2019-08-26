/* eslint-disable max-len */
import ResponseHandler from '../utils/ResponseHandler';

const confirmUser = (req, res, next) => {
  if (req.user.id !== parseInt(req.params.id, 10)) {
    ResponseHandler.error(res, 'you are not authorized to perform this action', 401);
  }
  next();
};
export default confirmUser;
