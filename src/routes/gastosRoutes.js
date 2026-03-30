const express = require('express');
const router = express.Router();
const {
  criarGasto,
  listarGastos,
  buscarGasto,
  atualizarGasto,
  deletarGasto,
} = require('../controllers/gastosController');
const autenticar = require('../middlewares/autenticar');

// Todas as rotas exigem autenticação
router.use(autenticar);

router.route('/').get(listarGastos).post(criarGasto);

router.route('/:id').get(buscarGasto).put(atualizarGasto).delete(deletarGasto);

module.exports = router;
