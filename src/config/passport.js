import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const FacebookStrategy = require('passport-facebook').Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_AUTH_CALLBACK_URL,
  GOOGLE_AUTH_CALLBACK_URL,
} = process.env;

/**
 * creates a user token
 * @param {string} accessToken - contains id, role email
 * @param {string} requestToken -
 * @param {string} profile - user profile
 * @param {string} done - user profile
 * @return {object} - user profile
 */
export const passportCb = (accessToken, requestToken, profile, done) => done(
  null, profile
);

const setupPassport = () => {
  passport.use(
    new GoogleStrategy({
      callbackURL: GOOGLE_AUTH_CALLBACK_URL,
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    }, passportCb)
  );
  passport.use(
    new FacebookStrategy({
      callbackURL: FACEBOOK_AUTH_CALLBACK_URL,
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      profileFields: [
        'id', 'email', 'gender', 'link', 'locale',
        'name', 'timezone', 'updated_time', 'verified'
      ],
    }, passportCb)
  );
};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

export default setupPassport;
