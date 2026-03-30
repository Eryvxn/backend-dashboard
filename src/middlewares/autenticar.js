const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const autenticar = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token de autenticação não fornecido',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token expirado, faça login novamente',
      });
    }
    next(error);
  }
};

module.exports = autenticar;
