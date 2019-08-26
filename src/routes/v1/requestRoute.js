import express from 'express';
import { bookTrip } from '../../controllers/RequestController';
import { checkToken } from '../../middlewares/authorization';

const router = express.Router();
router.post('/', checkToken, bookTrip);

export default router;
