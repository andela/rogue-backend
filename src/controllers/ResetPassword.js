import SendMessageObject from '../utils/ResetPassword';
import db from '../models';

const { sendMessage } = SendMessageObject;
const resetPasswordFunction = async (request, response) => {
  const { email } = request.body;
  const { User } = db;
  try {
    const dbResult = await User.findOne({
      where: { email }
    });
    if (dbResult) {
      const msg = {
        to: email,
        from: 'minaproblemsolver@gmail.com',
        subject: 'Testing From Mba Ifeanyi',
        html: '<button>Reset Password</>'
      };
      await sendMessage(msg);
      response.status(200).send('Check Your Email Address, click the button and Reset Your Password');
    }
  } catch (error) {
    return response.status(400).send('Unauthorized');
  }
};
export default resetPasswordFunction;
