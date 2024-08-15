const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Item = require('../models/Item');

router.post('/auto-create', async (req, res) => {
    try {
        const rejectedItems = req.body.rejectedItems;  // List of rejected items
        const salesInvoices = await Invoice.find({ type: 'Sales Invoice' }).sort({ date: 1 });  // Fetching all sales invoices sorted by date (FIFO)
        const salesReturns = [];  // Array to store created sales returns

        for (const invoice of salesInvoices) {
            const returnItems = [];  // Array to store return items for the current invoice

            for (const invoiceItem of invoice.items) {
                const rejectedItem = rejectedItems.find(item => item.itemCode === invoiceItem.itemCode);

                if (rejectedItem && rejectedItem.quantity > 0) {
                    const returnQuantity = Math.min(invoiceItem.quantity, rejectedItem.quantity);

                    returnItems.push({
                        itemCode: invoiceItem.itemCode,
                        quantity: -returnQuantity,  // Negative quantity for sales return
                        unitOfMeasure: invoiceItem.unitOfMeasure
                    });

                    rejectedItem.quantity -= returnQuantity;  // Reduce the rejected quantity

                    // Update inventory by adding the returned quantity back to the stock
                    await Item.findOneAndUpdate(
                        { itemCode: invoiceItem.itemCode },
                        { $inc: { quantity: returnQuantity } }
                    );
                }
            }

            if (returnItems.length > 0) {
                // Creating a sales return for the invoice
                const salesReturn = new Invoice({
                    invoiceNumber: `SR-${invoice.invoiceNumber}`,  // Prefix 'SR-' to original invoice number
                    customer: invoice.customer,
                    type: 'Sales Return',
                    items: returnItems
                });

                await salesReturn.save();  // Save the sales return
                salesReturns.push(salesReturn);  // Add the created sales return to the list
            }

            if (rejectedItems.every(item => item.quantity === 0)) {
                break;  // Exit loop if all rejected items have been processed
            }
        }

        res.status(201).json(salesReturns);  // Return the created sales returns
    } catch (error) {
        res.status(400).json({ message: error.message });  // Return error message in case of failure
    }
});


module.exports = router;