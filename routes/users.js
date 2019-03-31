let express = require('express');
let router = express.Router();
let users = require('../controllers/usersController');

router.get('/reg', users.showUserReg);
router.post('/reg', users.addUserReg);
module.exports = router;