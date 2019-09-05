import { UserController } from '../controllers';
import { Authorization } from '../middlewares';
import Validate from '../validation';

const userRoutes = app => {
  app.patch(
    '/api/v1/update_user',
    Authorization.checkToken,
    Validate.validateRoleUpdate,
    UserController.updateUserRole
  );
  app.patch(
    '/api/v1/profile',
    Authorization.checkToken,
    Authorization.confirmUser,
    Validate.validateUpdateProfile,
    UserController.updateProfile
  );
  app.get(
    '/api/v1/profile',
    Authorization.checkToken,
    UserController.getProfile
  );

  app.patch(
    '/api/v1/remember_details',
    Authorization.checkToken,
    Validate.validateRememberDetailsUpdate,
    UserController.rememberUserDetails
  );

  app.post(
    '/api/v1/reset_password',
    Authorization.checkToken,
    Validate.validateUserEmail,
    UserController.resetPassword
  );
};

export default userRoutes;
