import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const SendMessageObject = {
  sendMessage: (msg) => sgMail.send(msg)
};
export default SendMessageObject;
