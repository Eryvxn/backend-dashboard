const Venda = require('../models/Venda');
const Gasto = require('../models/Gasto');

// GET /dashboard
const getDashboard = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth(); // 0-indexed

    // Período do mês atual
    const iniciMesAtual = new Date(anoAtual, mesAtual, 1);
    const fimMesAtual = new Date(anoAtual, mesAtual + 1, 1);

    // Total de vendas e gastos do mês atual
    const [vendasMes, gastosMes] = await Promise.all([
      Venda.aggregate([
        {
          $match: {
            usuario: usuarioId,
            data: { $gte: iniciMesAtual, $lt: fimMesAtual },
          },
        },
        { $group: { _id: null, total: { $sum: '$valor' } } },
      ]),
      Gasto.aggregate([
        {
          $match: {
            usuario: usuarioId,
            data: { $gte: iniciMesAtual, $lt: fimMesAtual },
          },
        },
        { $group: { _id: null, total: { $sum: '$valor' } } },
      ]),
    ]);

    const totalVendasMes = vendasMes[0]?.total || 0;
    const totalGastosMes = gastosMes[0]?.total || 0;
    const lucroMes = totalVendasMes - totalGastosMes;

    // Evolução dos últimos 6 meses
    const evolucaoMensal = await calcularEvolucao(usuarioId, anoAtual, mesAtual);

    res.status(200).json({
      sucesso: true,
      dados: {
        totalVendasMes,
        totalGastosMes,
        lucroMes,
        evolucaoMensal,
      },
    });
  } catch (error) {
    next(error);
  }
};

const calcularEvolucao = async (usuarioId, anoAtual, mesAtual) => {
  const evolucao = [];

  for (let i = 5; i >= 0; i--) {
    let mes = mesAtual - i;
    let ano = anoAtual;

    if (mes < 0) {
      mes += 12;
      ano -= 1;
    }

    const inicio = new Date(ano, mes, 1);
    const fim = new Date(ano, mes + 1, 1);

    const [vendasAgg, gastosAgg] = await Promise.all([
      Venda.aggregate([
        { $match: { usuario: usuarioId, data: { $gte: inicio, $lt: fim } } },
        { $group: { _id: null, total: { $sum: '$valor' } } },
      ]),
      Gasto.aggregate([
        { $match: { usuario: usuarioId, data: { $gte: inicio, $lt: fim } } },
        { $group: { _id: null, total: { $sum: '$valor' } } },
      ]),
    ]);

    const nomesMeses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];

    const vendas = vendasAgg[0]?.total || 0;
    const gastos = gastosAgg[0]?.total || 0;

    evolucao.push({
      mes: nomesMeses[mes],
      ano,
      mesNumero: mes + 1,
      vendas,
      gastos,
      lucro: vendas - gastos,
    });
  }

  return evolucao;
};

module.exports = { getDashboard };
