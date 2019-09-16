import { AccommodationController } from '../controllers';
import { Authorization } from '../middlewares';
import Validate from '../validation';

const accommodationRoutes = app => {
  app.patch(
    '/api/v1/accommodation/like',
    Authorization.checkToken,
    Validate.validateLikeAccommodation,
    AccommodationController.likeAccommodation
  );
  app.post(
    '/api/v1/accommodation',
    Validate.validateUserInput,
    Authorization.checkToken,
    Authorization.confirmAdmin,
    AccommodationController.createAccommodation
  );
};

export default accommodationRoutes;
