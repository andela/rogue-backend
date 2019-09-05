import passport from 'passport';
import SocialController from '../controllers/socialController';

// social oauth with google
const socialAuthRoute = app => {
  app.get(
    '/api/v1/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get(
    '/api/v1/auth/google/redirect',
    passport.authenticate('google', {
      session: false
    }), SocialController.googleLogin,
  );

  app.get(
    '/api/v1/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
  );

  app.get(
    '/api/v1/auth/facebook/redirect',
    passport.authenticate('facebook', { session: false }),
    SocialController.facebookLogin,
  );
};

export default socialAuthRoute;
