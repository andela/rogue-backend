import chai from 'chai';
import sinon from 'sinon'; // eslint-disable-line import/no-extraneous-dependencies
import sendGrid from '@sendgrid/mail';
import { SendEmail } from '../../utils';

const { expect } = chai;
describe('Utility to send emails', () => {
  it('should send verification email after registration', async () => {
    const stubEmailSender = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await SendEmail.verifyEmail('jideajayi11@gmail.com');
    expect(response).to.equal(true);
    stubEmailSender.restore();
  });
  it('should send verification email after new trip request', async () => {
    const emailDetails = {
      user: { firstName: 'name', lastName: 'myName' },
      manager: { email: 'email', firtName: 'fisrtName' },
      dataValues: { id: '', origin: '', flightDate: '' }
    };
    const stubEmailSender = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await SendEmail.sendEmailNotification(emailDetails);
    expect(response).to.equal(true);
    stubEmailSender.restore();
  });
  it('should send email when passed the email details', async () => {
    const details = {
      email: 'jideajayi11@gmail.com',
      subject: 'Test Email Sending',
      emailBody: '<p>This email is being received</p>'
        + '<p>to test the utility that sends mail.'
    };
    const stubSendMethod = sinon.stub(sendGrid, 'send').returns(true);
    const response = await SendEmail.emailSender(details);
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });
  it('should send email when passed the email details*****', async () => {
    const details = {
      email: 'jideajayi11@gmail.com',
      subject: 'Test Email Sending',
      emailBody: '<p>This email is being received</p>'
      + '<p>to test the utility that sends mail.'
    };
    const stubSendMethod = sinon.stub(sendGrid, 'send').returns(true);
    const response = await SendEmail.resetPassword(details);
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });

  it('should send a mail to the user on completing registration', async () => {
    const stubSendMethod = sinon.stub(SendEmail, 'emailSender').returns(true);
    const response = await
    SendEmail.confirmRegistrationComplete('jideajayi11@gmail.com');
    expect(response).to.equal(true);
    sinon.assert.calledOnce(stubSendMethod);
    stubSendMethod.restore();
  });
});
