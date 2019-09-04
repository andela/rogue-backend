/**
 * Middleware for search requests route
 * Route: /request/search
 * @class SearchRequestsMiddleware
 */
class SearchRequestsMiddleware {
  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {void}
   * @memberof SearchRequestsMiddleware
   */
  static setMultiDestinationAndFlightDate(req, res, next) {
    const { destination, flightDate } = req.query;

    if (destination && Array.isArray(destination)) {
      delete req.query.destination;
      req.query = { ...req.query, multiDestination: destination };
    }

    if (flightDate && Array.isArray(flightDate)) {
      delete req.query.flightDate;
      req.query = { ...req.query, multiflightDate: flightDate };
    }

    next();
  }
}

export default SearchRequestsMiddleware;
