
import models from '../models';
import { HelperMethods } from '../utils';

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
    const { Message } = models;
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
    const notify = `
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
    res.send(notify);
  }
}
export default Notification;
