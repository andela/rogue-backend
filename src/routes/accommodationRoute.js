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
  app.post(
    '/api/v1/accommodation/comment',
    Authorization.checkToken,
    Validate.commentOnAccommodation,
    AccommodationController.commentOnAccommodation
  );
};

export default accommodationRoutes;
