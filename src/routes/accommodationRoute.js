import { AccommodationController } from '../controllers';
import { Authorization } from '../middlewares';
import Validate from '../validation';

const accommodationRoute = app => {
  app.patch(
    '/api/v1/accommodation/like',
    Authorization.checkToken,
    Validate.validateLikeAccommodation,
    AccommodationController.likeAccommodation
  );

  app.post(
    '/api/v1/accommodation',
    Authorization.checkToken,
    Authorization.confirmTravelAdminRole,
    Validate.validateUserInput,
    AccommodationController.createAccommodation
  );

  app.post(
    '/api/v1/accommodation',
    Authorization.checkToken,
    Validate.validateUserInput,
    AccommodationController.bookAnAccommodation
  );
};

export default accommodationRoute;
