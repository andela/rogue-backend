import express from 'express';
import { signUp, signIn, verifyUser } from '../../controllers/UserController';

const router = express.Router();
router.post('/signup', signUp);
router.post('/signin', signIn);
router.patch('/verifyaccount', verifyUser);

export default router;
