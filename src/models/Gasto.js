const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema(
  {
    valor: {
      type: Number,
      required: [true, 'Valor é obrigatório'],
      min: [0.01, 'Valor deve ser maior que zero'],
    },
    descricao: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      trim: true,
      minlength: [2, 'Descrição deve ter pelo menos 2 caracteres'],
    },
    data: {
      type: Date,
      required: [true, 'Data é obrigatória'],
      default: Date.now,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para consultas frequentes
gastoSchema.index({ usuario: 1, data: -1 });

module.exports = mongoose.model('Gasto', gastoSchema);
