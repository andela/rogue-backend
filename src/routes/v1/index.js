import express from 'express';
import authRoute from './authRoute';
import requestRoute from './requestRoute';

const router = express.Router();
router.use('/auth', authRoute);
router.use('/request', requestRoute);

export default router;
