require('dotenv').config();
console.log("ENV TESTE:", process.env.MONGO_URI);
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
};

iniciar();
