import express from 'express';
import Users from '../../controllers/users';
const router = express.Router();


router.post('/auth/signup', Users.create)


module.exports = router;
