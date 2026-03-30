const Gasto = require('../models/Gasto');

// Utilitário para montar filtro de período
const filtrarPorMes = (mes, ano) => {
  if (!mes) return {};

  const mesNum = parseInt(mes);
  const anoNum = ano ? parseInt(ano) : new Date().getFullYear();

  const inicio = new Date(anoNum, mesNum - 1, 1);
  const fim = new Date(anoNum, mesNum, 1);

  return { data: { $gte: inicio, $lt: fim } };
};

// POST /gastos
const criarGasto = async (req, res, next) => {
  try {
    const { valor, descricao, data } = req.body;

    if (!valor || !descricao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Valor e descrição são obrigatórios',
      });
    }

    const gasto = await Gasto.create({
      valor,
      descricao,
      data: data || Date.now(),
      usuario: req.usuario._id,
    });

    res.status(201).json({
      sucesso: true,
      mensagem: 'Gasto registrado com sucesso',
      dados: { gasto },
    });
  } catch (error) {
    next(error);
  }
};

// GET /gastos
const listarGastos = async (req, res, next) => {
  try {
    const { mes, ano, page = 1, limit = 20 } = req.query;

    const filtro = {
      usuario: req.usuario._id,
      ...filtrarPorMes(mes, ano),
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [gastos, total] = await Promise.all([
      Gasto.find(filtro).sort({ data: -1 }).skip(skip).limit(parseInt(limit)),
      Gasto.countDocuments(filtro),
    ]);

    res.status(200).json({
      sucesso: true,
      dados: {
        gastos,
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

// GET /gastos/:id
const buscarGasto = async (req, res, next) => {
  try {
    const gasto = await Gasto.findOne({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!gasto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Gasto não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: { gasto },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /gastos/:id
const atualizarGasto = async (req, res, next) => {
  try {
    const { valor, descricao, data } = req.body;

    const gasto = await Gasto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      { valor, descricao, data },
      { new: true, runValidators: true }
    );

    if (!gasto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Gasto não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Gasto atualizado com sucesso',
      dados: { gasto },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /gastos/:id
const deletarGasto = async (req, res, next) => {
  try {
    const gasto = await Gasto.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id,
    });

    if (!gasto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Gasto não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Gasto deletado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { criarGasto, listarGastos, buscarGasto, atualizarGasto, deletarGasto };
