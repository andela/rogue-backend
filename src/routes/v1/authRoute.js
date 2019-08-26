import express from 'express';

import UserController from '../../controllers/UserController';

const router = express.Router();
router.post('/signup', UserController.signUpController);
//router.post('/signin', signIn);
//router.patch('/verifyaccount', verifyUser);

export default router;
