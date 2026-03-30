const Venda = require('../models/Venda');

// Utilitário para montar filtro de período
const filtrarPorMes = (mes, ano) => {
  if (!mes) return {};

  const mesNum = parseInt(mes);
  const anoNum = ano ? parseInt(ano) : new Date().getFullYear();

  const inicio = new Date(anoNum, mesNum - 1, 1);
  const fim = new Date(anoNum, mesNum, 1);

  return { data: { $gte: inicio, $lt: fim } };
};

// POST /vendas
const criarVenda = async (req, res, next) => {
  try {
    const { valor, descricao, data } = req.body;

    if (!valor || !descricao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Valor e descrição são obrigatórios',
      });
    }

    const venda = await Venda.create({
      valor,
      descricao,
      data: data || Date.now(),
      usuario: req.usuario._id,
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Venda registrada com sucesso',
      dados: { venda },
    });
  } catch (error) {
    next(error);
  }
};

// GET /vendas
const listarVendas = async (req, res, next) => {
  try {
    const { mes, ano, page = 1, limit = 20 } = req.query;

    const filtro = {
      usuario: req.usuario._id,
      ...filtrarPorMes(mes, ano),
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [vendas, total] = await Promise.all([
      Venda.find(filtro).sort({ data: -1 }).skip(skip).limit(parseInt(limit)),
      Venda.countDocuments(filtro),
    ]);

    res.status(200).json({
      sucesso: true,
      dados: {
        vendas,
        paginacao: {
          total,
          pagina: parseInt(page),
          totalPaginas: Math.ceil(total / parseInt(limit)),
          porPagina: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /vendas/:id
const buscarVenda = async (req, res, next) => {
  try {
    const venda = await Venda.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!venda) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Venda não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: { venda },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /vendas/:id
const atualizarVenda = async (req, res, next) => {
  try {
    const { valor, descricao, data } = req.body;

    const venda = await Venda.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      { valor, descricao, data },
      { new: true, runValidators: true }
    );

    if (!venda) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Venda não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Venda atualizada com sucesso',
      dados: { venda },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /vendas/:id
const deletarVenda = async (req, res, next) => {
  try {
    const venda = await Venda.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!venda) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Venda não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Venda deletada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { criarVenda, listarVendas, buscarVenda, atualizarVenda, deletarVenda };
