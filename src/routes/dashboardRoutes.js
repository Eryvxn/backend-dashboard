const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const autenticar = require('../middlewares/autenticar');

router.get('/', autenticar, getDashboard);

module.exports = router;
