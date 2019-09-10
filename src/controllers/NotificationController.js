
import models from '../models';
import { HelperMethods } from '../utils';

/**
 * Class representing the Notification controller
 * @class Notification
 * @description notification controller
 */
class Notification {
  /**
   * Test real-time in-app notification
   * Route: POST: api/v1/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof Notification
   */
  static async notifyManager(req, res) {
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
          <h2 id="messageCount"></h2>
          <div id="message-container">
          </div>
          <script>
            const socket = io();
            let countMessage = ${messageCount};
            const messageCount = messageCount => {
              const message = document.getElementById('messageCount');
              message.textContent = 'Messages:' + messageCount;
            };
            const messageDisplay = (message) => {
              const div = document.getElementById('message-container');
              let paragraph = document.createElement('p');
              paragraph.appendChild(document.createTextNode(message));
              div.appendChild(paragraph);
            };
            messageCount(${messageCount});
            socket.on('${id}', data => {
              messageDisplay(data)
              countMessage += 1;
              messageCount(countMessage);
            });
          </script>
        </body>
      </html>
    `;
    res.send(notify);
  }

  /**
   * Test real-time in-app notification
   * Route: POST: api/v1/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {res} res - HTTP Response object
   * @memberof Notification
  */
  static async notifyUser(req, res) {
    const { id } = req.params;
    const { Message } = models;
    let messageCount;
    let messageBody;
    try {
      const messages = await Message.findAll({
        where: {
          userId: id,
          isRead: false,
        }
      });
      messageBody = messages.map(msg => msg.dataValues);
      messageCount = messageBody.length;
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
          <h2 id="messageCount"></h2>
          <div id="message-container">
          </div>
          <a href="" id='all-messages'>Link</a>
          <script>
            const socket = io();
            let countMessage = ${messageCount};
            const messageCount = messageCount => {
              const message = document.getElementById('messageCount');
              message.textContent = 'Messages:' + messageCount;
            };
            const messageDisplay = (message) => {
              const div = document.getElementById('message-container');
              let paragraph = document.createElement('p');
              paragraph.appendChild(document.createTextNode(message));
              div.appendChild(paragraph);
            };
            messageCount(${messageCount});
            
            socket.on('${id}', data => {
              messageDisplay(data)
              countMessage += 1;
              messageCount(countMessage);
            });            
          </script>
        </body>
      </html>
    `;
    res.send(notify);
  }
}
export default Notification;
