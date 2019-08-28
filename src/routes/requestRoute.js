import { RequestController } from '../controllers';
import Authorization from '../middlewares';
import Validate from '../validation';

const requestRoutes = app => {
  app.post('/api/v1/request/book_trip',
    Validate.validateUserInput,
    Authorization.checkToken,
    RequestController.bookATrip);

  app.post('/api/v1/request/book_return_trip',
    Authorization.checkToken,
    Validate.validateUserInput,
    RequestController.bookAReturnTrip);
};

export default requestRoutes;
