import { RequestController } from '../controllers';
import { Authorization, SearchRequestsMiddleware } from '../middlewares';
import Validate from '../validation';

const requestRoutes = app => {
  app.post(
    '/api/v1/request/book_trip',
    Authorization.checkToken,
    Validate.validateBookTrip,
    Validate.validateFlightDateFormat,
    Authorization.convertDateToValidFormat,
    RequestController.bookATrip
  );

  app.post(
    '/api/v1/request/book_return_trip',
    Authorization.checkToken,
    Validate.validateBookTrip,
    Validate.validateReturnDate,
    Validate.validateReturnDateFormat,
    Authorization.convertDateToValidFormat,
    RequestController.bookAReturnTrip
  );

  app.get(
    '/api/v1/requests',
    Authorization.checkToken,
    Authorization.confirmRole,
    RequestController.getPendingRequests
  );

  app.patch(
    '/api/v1/request/approve',
    Authorization.checkToken,
    Authorization.confirmRole,
    RequestController.approveRequest
  );
  app.patch(
    '/api/v1/request/edit',
    Authorization.checkToken,
    RequestController.editRequest
  );

  app.patch(
    '/api/v1/request/reject',
    Authorization.checkToken,
    Authorization.confirmRole,
    RequestController.rejectRequest
  );

  app.post(
    '/api/v1/request/multicity',
    Authorization.checkToken,
    Validate.validateMulticity,
    Validate.validateFlightDateFormat,
    Authorization.convertDateToValidFormat,
    RequestController.bookMulticity
  );

  app.get(
    '/api/v1/request/search',
    Authorization.checkToken,
    Validate.validateSearchRequests,
    SearchRequestsMiddleware.setMultiDestinationAndFlightDate,
    RequestController.searchRequests
  );

  app.patch(
    '/api/v1/request/confirm',
    Authorization.checkToken,
    Authorization.confirmRole,
    Validate.validateConfirmRequest,
    RequestController.confirmRequestApproval
  );
};

export default requestRoutes;
