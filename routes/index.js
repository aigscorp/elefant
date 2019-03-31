let express = require('express');
let router = express.Router();
let index = require('../controllers/indexController');

router.get('/', index.main);
router.post('/login', index.login);
router.post('/logout', index.logout);
router.post('/elefant', index.query);
module.exports = router;