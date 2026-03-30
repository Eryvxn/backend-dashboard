const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /auth/registro
const registro = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, e-mail e senha são obrigatórios',
      });
    }

    const usuario = await Usuario.create({ nome, email, senha });

    const token = gerarToken(usuario._id);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      dados: {
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'E-mail e senha são obrigatórios',
      });
    }

    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'E-mail ou senha inválidos',
      });
    }

    const token = gerarToken(usuario._id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      dados: {
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /auth/perfil
const perfil = async (req, res) => {
  res.status(200).json({
    sucesso: true,
    dados: {
      usuario: {
        id: req.usuario._id,
        nome: req.usuario.nome,
        email: req.usuario.email,
        criadoEm: req.usuario.createdAt,
      },
    },
  });
};

module.exports = { registro, login, perfil };
