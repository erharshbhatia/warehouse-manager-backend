const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  unitOfMeasure: { type: String, required: true },
});

module.exports = mongoose.model('Item', itemSchema);