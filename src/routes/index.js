/* eslint-disable import/no-cycle */
import authRoute from './authRoute';
import requestRoute from './requestRoute';
import userRoute from './userRoute';
import socialAuthRoute from './socialAuthRoute';
import notificationRoute from './notificationRoute';
/**
 * Handles request
 * @param {object} app - An instance of the express module
 * @returns {object} - An object containing all routes
 */

const routes = app => {
  app.get('/api/v1/', (req, res) => {
    res.status(200).send({
      success: true,
      message: 'Welcome to the BareFoot-Nomad API'
    });
  });
  authRoute(app);
  requestRoute(app);
  userRoute(app);
  socialAuthRoute(app);
  notificationRoute(app);
};

export default routes;
