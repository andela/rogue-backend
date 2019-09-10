import { AccommodationController } from '../controllers';
import { Authorization } from '../middlewares';
import Validate from '../validation';

const accommodationRoute = app => {
  app.post(
    '/api/v1/accommodation',
    Validate.validateUserInput,
    Authorization.checkToken,
    AccommodationController.bookAnAccommodation
  );
};

export default accommodationRoute;
