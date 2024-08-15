const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitOfMeasure: { type: String, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  type: { type: String, enum: ['Sales Invoice', 'Sales Return'], required: true },
  items: [invoiceItemSchema],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);