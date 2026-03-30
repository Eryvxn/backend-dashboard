const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let mensagem = err.message || 'Erro interno do servidor';

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const erros = Object.values(err.errors).map((e) => e.message);
    mensagem = erros.join('. ');
  }

  // Erro de chave duplicada (email já cadastrado)
  if (err.code === 11000) {
    statusCode = 409;
    const campo = Object.keys(err.keyValue)[0];
    mensagem = `${campo === 'email' ? 'E-mail' : campo} já está em uso`;
  }

  // Erro de cast (ID inválido)
  if (err.name === 'CastError') {
    statusCode = 400;
    mensagem = `ID inválido: ${err.value}`;
  }

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Erro:', err);
  }

  res.status(statusCode).json({
    sucesso: false,
    mensagem,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
