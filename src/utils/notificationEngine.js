import { io } from '../index';

/**
  * Notify a User when he edits his request
  * @param {object} - object
  * @memberof Notification
  */
class Notification {
  /**
  * Notify a User when he edits his request
  * @memberof Notification
  * @param {String} message - the notification message
  * @returns {void} void
  */
  static async notifyUser(message) {
    console.log(message)
    return io.emit('message', message);
  }
}

export default Notification;

