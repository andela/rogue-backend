import express from 'express';
import UserController from '../../controllers/UserController';
import Sanitizer from '../../middlewares/sanitizer';
const router = express.Router();
router.post('/signup',Sanitizer.signupSanitizer, UserController.signUpController);

export default router;
