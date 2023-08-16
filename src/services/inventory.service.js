"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "131 tran phu ho chi minh",
    }) {
        const product = await getProductById(productId);
        if (!product) {
            throw new BadRequestError("The product dose not exist");
        }
        const query = {
            inventory_shopId: shopId,
            inventory_productId: productId,
        };
        const updateSet = {
            $inc: { inventory_Stock: stock },
            $set: {
                inventory_location: location,
            },
        };
        const options = {
            upsert: true,
            new: true,
        };
        return await inventoryModel.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;
