const express = require('express');
const router = express.Router();
const {
  criarVenda,
  listarVendas,
  buscarVenda,
  atualizarVenda,
  deletarVenda,
} = require('../controllers/vendasController');
const autenticar = require('../middlewares/autenticar');

// Todas as rotas exigem autenticação
router.use(autenticar);

router.route('/').get(listarVendas).post(criarVenda);

router.route('/:id').get(buscarVenda).put(atualizarVenda).delete(deletarVenda);

module.exports = router;
