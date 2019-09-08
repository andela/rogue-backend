import { NotificationController } from '../controllers';

const notificationRoute = app => {
  app.get(
    '/api/v1/managerNotification/:id',
    NotificationController.notify
  );
};
export default notificationRoute;
