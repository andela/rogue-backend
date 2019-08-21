import { UserController } from '../controllers';
import Authorization from '../middlewares';
import Validate from '../validation';

const userRoutes = app => {
  app.patch('/api/v1/updateuser',
    Authorization.checkToken,
    Validate.validateRoleUpdate,
    UserController.updatedUser);
};

export default userRoutes;
