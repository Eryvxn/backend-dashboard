const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const vendasRoutes = require('./routes/vendasRoutes');
const gastosRoutes = require('./routes/gastosRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: '🍦 API Sorveteria online!',
    versao: '1.0.0',
  });
});

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota ${req.originalUrl} não encontrada`,
  });
});

// Middleware de erro global (deve ser o último)
app.use(errorHandler);

module.exports = app;
