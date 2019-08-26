import express from 'express';
import authRoute from './authRoute';
import profileRoute from './ProfileRoute';
import requestRoute from './requestRoute';

const router = express.Router();
router.use('/auth', authRoute);
router.use('/auth', profileRoute);
router.use('/request', requestRoute);
export default router;
