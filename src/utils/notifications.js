/* eslint-disable import/no-cycle */
import models from '../models';
import { HelperMethods, SendEmail } from './index';
import { io } from '../index';

const { User, Message } = models;
/* eslint-disable max-len */
/**
 * @description contains utility functions to send to send push and email notifications
 */
class Notification {
  /**
   * @param {object} res HTTP response object
   * @param {string} notificationParams - object containing notification parameters
   * @returns {*} sends notifications
   */
  static async sendNewRequestNotifications(res, notificationParams) {
    try {
      const { id, requestId, type } = notificationParams;
      const user = await User.findByPk(id);
      const message = `${user.username} created a travel request`;
      io.emit(user.lineManager, message);
      const manager = await User.findByPk(user.lineManager);
      const { firstName, email } = manager.dataValues;
      if (user.isSubscribed) {
        await SendEmail.sendRequestNotification(
          email,
          firstName,
          requestId,
          type
        );
      }

      await Message.create({
        message,
        userId: id,
        lineManager: user.dataValues.lineManager,
        type: 'creation'
      });
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }
}
export default Notification;

