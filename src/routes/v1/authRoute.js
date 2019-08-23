import express from 'express';
import { signUp } from '../../controllers/UserController';

const router = express.Router();
router.post('/signup', signUp);

export default router;
