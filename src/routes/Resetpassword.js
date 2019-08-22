import express from 'express';
import resetpasswordFunction from '../controllers/ResetPassword';

const router = express.Router();

router.post('/resetpassword', resetpasswordFunction);
export default router;
