Routes

The application uses react-router-dom for navigation. The following routes are defined:

/: Displays the Inventory component.

/manage-inventory: Displays the InventoryManagement component.

/create-invoice: Displays the CreateInvoice component.

/auto-return: Displays the AutoReturn component.

Usage

Inventory: View all inventory items, reset inventory and invoices.

Manage Inventory: Create new inventory items or update existing ones.

Create Invoice: Generate new sales invoices.

Auto Return: Automatically create sales returns for rejected items.

API Integration Endpoints used in the application:

GET /api/items: Fetch all inventory items.

POST /api/items: Create a new inventory item.

PUT /api/items/:itemCode: Update an existing inventory item.

PATCH /api/items/:itemCode: Update the quantity of an inventory item.

POST /api/items/reset-inventory: Reset the entire inventory and related invoices.

POST /api/returns/auto-create: Automatically create sales returns based on rejected items.
