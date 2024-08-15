const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Item = require('../models/Item');

// Create a new invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice({
      invoiceNumber: req.body.invoiceNumber,
      customer: req.body.customer,
      type: req.body.type,
      items: req.body.items,
    });

    for (const item of req.body.items) {
      const inventoryItem = await Item.findOne({ itemCode: item.itemCode });
      if (!inventoryItem) {
        throw new Error(`Item ${item.itemCode} not found in inventory`);
      }

      const quantityChange = req.body.type === 'Sales Invoice' ? -item.quantity : item.quantity;
      inventoryItem.quantity += quantityChange;

      if (inventoryItem.quantity < 0) {
        throw new Error(`Insufficient stock for item ${item.itemCode}`);
      }

      await inventoryItem.save();
    }

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    // If an error occurs, we should revert any changes made to the inventory
    if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
      for (const item of req.body.items) {
        const inventoryItem = await Item.findOne({ itemCode: item.itemCode });
        if (inventoryItem) {
          const quantityChange = req.body.type === 'Sales Invoice' ? item.quantity : -item.quantity;
          inventoryItem.quantity += quantityChange;
          await inventoryItem.save();
        }
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;