import { sequelize, Sequelize } from '../models/index';
import userModel from '../models/User';
import ResponseHandler from '../utils/ResponseHandler';

const Users = userModel(sequelize, Sequelize.DataTypes);

const isProfileUpdated = async (req, res, next) => {
  const userEmail = req.body.email;
  try {
    const user = await Users.findOne({ where: { email: userEmail } });
    if (!user.gender) {
      // eslint-disable-next-line max-len
      ResponseHandler.error(res, 'No profile set up. Redirecting to profile settings page...', 404);
      // Or redirect to profile settings page
    }
    next();
  } catch (error) {
    ResponseHandler.error(res, 'No user with that email was found', 404);
  }
};
export default isProfileUpdated;
