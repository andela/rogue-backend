import { NotificationController } from '../controllers';

const notificationRoute = app => {
  app.get(
    '/api/v1/managerNotification/:id',
    NotificationController.notify
  );
  app.get(
    '/api/v1/userNotification/:id',
    NotificationController.notifyUserOfEditedRequest,
  );
};
export default notificationRoute;
