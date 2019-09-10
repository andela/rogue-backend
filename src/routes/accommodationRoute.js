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
};

export default accommodationRoutes;
