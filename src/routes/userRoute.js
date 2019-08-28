import { UserController } from '../controllers';
import Authorization from '../middlewares';
import Validate from '../validation';

const userRoutes = app => {
  app.patch('/api/v1/update_user',
    Authorization.checkToken,
    Validate.validateRoleUpdate,
    UserController.updateUserRole);
};

export default userRoutes;
