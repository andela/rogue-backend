import { Notification } from '../utils';

const notificationRoute = app => {
  app.get(
    '/api/v1/managerNotification/:id',
    Notification.notify
  );
};
export default notificationRoute;
