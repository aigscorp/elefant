let express = require('express');
let router = express.Router();
let tasks = require('../controllers/tasksController');

router.get('/add', tasks.showTask);
router.post('/add', tasks.addTask);
router.post('/edit', tasks.editTask);
router.post('/save', tasks.saveTask);
module.exports = router;