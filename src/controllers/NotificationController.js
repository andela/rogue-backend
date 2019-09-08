
import models from '../models';
import { HelperMethods, SendEmail } from '../utils';

const { Message, User } = models;
/**
 * Class representing the Notification controller
 * @class Notification
 * @description notification controller
 */
class Notification {
  /**
   * Test real-tim in-app notification
   * Route: POST: api/v1/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof Notification
   */
  static async notify(req, res) {
    const { id } = req.params;
    let messageCount;
    try {
      const messages = await Message.findAll({
        where: {
          lineManager: id,
          isRead: false,
        }
      });
      messageCount = messages.length;
    } catch (error) {
      return HelperMethods.clientError(res);
    }
    const testFile = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Barefoot Nomad</title>
          <script src="/socket.io/socket.io.js"></script>
        </head>
        <body>
          <h1>Barefoot Nomad</h1>
          <h2 id="message"></h2>
          <script>
            const socket = io();
            let countMessage = ${messageCount};
            const messageDisplay = messageCount => {
              const message = document.getElementById('message');
              message.textContent = 'Messages:' + messageCount;
            };
            messageDisplay(${messageCount});
            const showDesktopNotification = (message, body, icon, sound, timeout) => {
              if (!timeout) {
                timeout = 4000;
              }
              const Notification = window.Notification || window.mozNotification 
              || window.webkitNotification;
              Notification.requestPermission(permission => {});

              const requestNotificationPermissions = () => {
                if (Notification.permission !== 'denied') {
                  Notification.requestPermission(permission => {});
                }
              }
              requestNotificationPermissions();
              const instance = new Notification(message, {
                body,
                icon,
                sound
              });
              if (sound) {
                instance.sound;
              }
              setTimeout(instance.close.bind(instance), timeout);
              return false;
            };
            const sendNodeNotification = (title, message, icon) => {
              socket.emit('new_notification', {
                message,
                title,
                icon
              });
            };

            const setNotification = data => {
              showDesktopNotification('Barefoot Nomad', data, '/index.png');
              sendNodeNotification(
                'Barefoot Nomad',
                'Browser Notification..!',
                '/index.png'
              );
            };

            socket.on('${id}', data => {
              countMessage += 1;
              messageDisplay(countMessage);
              setNotification(data);
            });

            socket.on('show_notification', data => {
              showDesktopNotification(data.title, data.message, data.icon);
            });
          </script>
        </body>
      </html>
    `;
    res.send(testFile);
  }

  /**
   * @param {object} req HTTP request object
   * @param {object} res HTTP response object
   * @param {string} notificationParams - object containing notification parameters
   * @returns {*} sends notifications
   */
  static async sendNewRequestNotifications(req, res, notificationParams) {
    try {
      const { id, dataValues, type } = notificationParams;
      const user = await User.findByPk(id);
      if (user.id) {
        const manager = await User.findByPk(user.lineManager);
        if (manager.id) {
          const { firstName, email } = manager.dataValues;
          const message = `${user.username} created a travel request`;
          req.io.emit(user.lineManager, message);
          if (user.isSubscribed) {
            await SendEmail.sendRequestNotification({
              managerEmail: email,
              managerName: firstName,
              requester: `${user.firstName} ${user.lastName}`,
              requestId: dataValues.id,
              origin: dataValues.origin,
              destination: dataValues.destination,
              flightDate: dataValues.flightDate,
              reason: dataValues.reason,
              type
            });
          }
          const createMessage = await Message.create({
            message,
            userId: id,
            lineManager: user.dataValues.lineManager,
            type: 'creation'
          });
          if (!createMessage.dataValues) {
            return HelperMethods.serverError(res);
          }
        }
        return HelperMethods.serverError(res);
      }
      return HelperMethods.serverError(res);
    } catch (error) {
      return HelperMethods.serverError(res);
    }
  }
}
export default Notification;
