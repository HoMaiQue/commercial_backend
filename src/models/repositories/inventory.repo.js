"use strict";
const { convertToObjectIdMongodb } = require("../../utils");
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

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inventory_productId: convertToObjectIdMongodb(productId),
        inventory_stock: { $gte: quantity },
    };
    const updateSet = {
        $inc: {
            inventory_stock: -quantity,
        },
        $push: {
            inventory_reservation: { quantity, cartId, createOn: new Date() },
        },
    };
    const options = {
        upsert: true, new: true
    }

    return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
    insertInventory,
    reservationInventory
};
