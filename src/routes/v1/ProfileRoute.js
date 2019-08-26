import express from 'express';
import Profile from '../../controllers/ProfileUpdateController';
import profileChecker from '../../middlewares/CheckProfile';
import checkToken from '../../middlewares/authorization';
import confirmUser from '../../middlewares/ConfirmUser';

const router = express.Router();

router.post('/signup_test', Profile.create);
router.post('/signin_test', profileChecker, Profile.signInUser);
router.patch('/user/:id', checkToken, confirmUser, Profile.updateProfile);
router.get('/user/:id', checkToken, confirmUser, Profile.getProfile);

export default router;

