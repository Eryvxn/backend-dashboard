const express = require('express');
const router = express.Router();
const { registro, login, perfil } = require('../controllers/authController');
const autenticar = require('../middlewares/autenticar');

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', autenticar, perfil);

module.exports = router;
