const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Invoice = require('../models/Invoice')

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new item
router.post('/', async (req, res) => {
    try {
        const existingItem = await Item.findOne({ itemCode: req.body.itemCode });
        if (existingItem) {
            return res.status(400).json({ message: 'Item already exists. Use PUT to update.' });
        }

        const item = new Item({
            itemCode: req.body.itemCode,
            quantity: req.body.quantity,
            unitOfMeasure: req.body.unitOfMeasure,
        });

        const newItem = await item.save();
        res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an existing item
router.put('/:itemCode', async (req, res) => {
    try {
        const item = await Item.findOne({ itemCode: req.params.itemCode });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.quantity = req.body.quantity;
        item.unitOfMeasure = req.body.unitOfMeasure;

        await item.save();
        res.json({ message: 'Item updated successfully', item });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update item quantity
router.patch('/:itemCode', async (req, res) => {
    try {
        const item = await Item.findOne({ itemCode: req.params.itemCode });
        if (item == null) {
            return res.status(404).json({ message: 'Item not found' });
        }
        item.quantity += req.body.quantityChange;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/reset-inventory',  async (req, res) => {
    try {
        // Delete all items
        await Item.deleteMany({});

        // Delete all invoices
        await Invoice.deleteMany({});

        res.status(200).json({ message: 'Inventory and invoices have been reset successfully' });
    } catch (error) {
        console.error('Error resetting inventory:', error);
        res.status(500).json({ message: 'Failed to reset inventory and invoices' });
    }
});

module.exports = router;