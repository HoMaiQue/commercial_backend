"use strict";
const inventoryModel = require("../inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
    product_id,
    shopId,
    stock,
    location = "unknown",
}) => {
    return await inventoryModel.create({
        inventory_productId: product_id,
        inventory_shopId: shopId,
        inventory_stock: stock,
        inventory_location: location,
    });
};

module.exports = {
    insertInventory,
};
