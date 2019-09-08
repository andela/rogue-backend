import sendGrid from '@sendgrid/mail';

let baseUrl = '';

if (process.env.NODE_ENV !== 'production') {
  baseUrl = process.env.SENDGRID_DEVELOPMENT__URL;
} else {
  baseUrl = process.env.SENDGRID_PRODUCTION__URL;
}

/* eslint-disable max-len */
/**
 * @description contains utility function to send emails
 */
class SendEmail {
  /**
   * @param {string} email - email address to send the message to
   * @param {string} firstName - User's first name
   * @param {string} token - Token generated during signup
   * @returns {boolean} specifies if the email was sent successfully
   */
  static verifyEmail(email, firstName, token) {
    const details = {
      email,
      subject: 'Email Verification - BareFoot-Nomad',
      html: `'<div style="width: 90%; margin: 5em auto;
       box-shadow: 0 0 10px rgba(0,0,0,.9);">
        <div>
          <div>
            <div style="background-color: #2084ba; height: 3rem; width: 100%">
                <h2 style="text-align: center; color: white;
                 padding-top: 10px;">Barefoot Nomad</h2>
            </div>
            <h4 style="text-align: center">Hi! ${firstName}</h4>
          </div>
          <div style=" padding: 0px 20px 20px 20px">
            <div>
              <p>Please verify that your email is <strong>${email}</strong>
               when you signed up.</p>
              <p>Click on the button below to verify.</p>
              <button style="color: white; background-color: #2084ba;
               border: none; border-radius: 10px; text-align: center;
                padding: 10px;">
                <a  href="${baseUrl}/auth/verify_email?token=${token}"
                 style="text-decoration: none;
                 color: white;">Verify Account</a></button>
            </div>
            <div>
              <h3 style="text-align: center">Thank you</h3>
              <h3 style="text-align: center">
              Please do not reply, this is an autogenerated email.</h3>
            </div>
          </div>
        </div>
      </div>`,
    };
    return SendEmail.emailSender(details);
  }

  /**
   * @param {string} emailParams - email address to send the message to
   * @param {string} firstName - User's first name
   * @param {string} requestId - The Id of the request
   * @param {string} requestType - multicity || single Trip || Return Trip
   * @returns {boolean} specifies if the email was sent successfully
   */
  static sendRequestNotification(emailParams) {
    const details = {
      email: 'nwodochristian@gmail.com',
      subject: 'New pending request - BareFoot-Nomad',
      html: `'<div style="width: 90%; margin: 5em auto;
       box-shadow: 0 0 10px rgba(0,0,0,.9);">
        <div>
          <div>
            <div style="background-color: #2084ba; height: 3rem; width: 100%">
                <h2 style="text-align: center; color: white;
                 padding-top: 10px;">Barefoot Nomad</h2>
            </div>
            <h1 style="text-align: center">Hi! ${emailParams.managerName}</h1>
          </div>
          <div style=" padding: 0px 20px 20px 20px">
            <div>
              <p>There is a new request from user: <strong>${emailParams.requester}</strong> that needs your action</p>
              <p>Below are the details of the request:</p></br>
              <ul>
                <li>Origin: ${emailParams.origin}</li>
                <li>Destination: ${emailParams.destination}</li>
                <li>Reason: ${emailParams.reason}</li>
                <li>Type: ${emailParams.type}</li>
                <li>Flight Date: ${emailParams.flightDate}</li>
                <li>Requester: ${emailParams.requester}</li>
              </ul>
              <button style="color: white; background-color: #1AC124;
               border: none; border-radius: 10px; text-align: center;
                padding: 10px;">
                <a  href="${baseUrl}/request/approve/${emailParams.requestId}"
                 style="text-decoration: none;
                 color: white;">Approve Request</a></button>
                 
                 <button style="color: white; background-color: #DE4727;
               border: none; border-radius: 10px; text-align: center;
                padding: 10px;">
                <a  href="${baseUrl}/request/reject/${emailParams.requestId}"
                 style="text-decoration: none;
                 color: white;">Reject Request</a></button>
            </div>
            <div>
              <h3 style="text-align: center">Thank you</h3>
              <h3 style="text-align: center">
              Please do not reply, this is an autogenerated email.</h3>
            </div>
          </div>
        </div>
      </div>`,
    };
    return SendEmail.emailSender(details);
  }
  /* eslint-enable max-len */

  /**
   * This function sends an email on verification of email address
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} specifies if a verification email was sent to user
   * after registration
  */
  static confirmRegistrationComplete(email) {
    const details = {
      email,
      subject: 'Email Verification - BareFoot-Nomad',
      html: `<p>Your registration has been completed<p>
      <p>Thank you for registering with BareFoot-Nomad.</p>
       <p> >>>
       <a href=${baseUrl}/home> Go to your profile </a> <<< </p>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   * This function sends an email to reset password
   * @param {string} email - email address to send the message to
   * @returns {boolean} specifies if a verification email was sent to user
   * after registration
  */
  static resetPassword(email) {
    const details = {
      email,
      subject: 'Reset Password - BareFoot-Nomad',
      html: `<div>
        <p>Click on the button below to reset your password.</p>
        <button style="color: white; background-color: #2084ba; 
        border: none; border-radius: 10px; text-align: center;
        padding: 10px;">
        <a  href="${baseUrl}"
          style="text-decoration: none; color: white;">
        Reset Password</a></button>
        </div>`
    };
    return SendEmail.emailSender(details);
  }

  /**
   *
   * @param {object} details - Object containing info for sending email
   * @returns {boolean} sends email to users
   */
  static async emailSender(details) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: process.env.mail_master,
      html: details.html,
      subject: details.subject,
      to: details.email
    };
    try {
      const isEmailSent = await sendGrid.send(msg);
      if (isEmailSent) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  /**
     *
     * @param {object} user Object containing user's information
     * @param {object} manager Object containing manager's information
     * @param {object} dataValues Contains information about new trip request
     * @param {string} type return trip || single trip || multi-city trip
     * @returns {object} Object containing data for sending mail
     */
  static async newTripData(user, manager, dataValues, type) {
    const { firstName, email, } = manager.dataValues;
    return {
      managerEmail: email,
      managerName: firstName,
      requester: `${user.firstName} ${user.lastName}`,
      requestId: dataValues.id,
      origin: dataValues.origin,
      destination: dataValues.destination,
      flightDate: dataValues.flightDate,
      reason: dataValues.reason,
      type,
    };
  }
}
export default SendEmail;
