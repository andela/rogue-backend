const router = require("express").Router();
const Users = require('../../controllers/users')


router.post('/auth/signup', Users.create)


module.exports = router;
