"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
    {
        inventory_productId: {
            type: Schema.Types.ObjectId,
            ref: "product",
        },
        inventory_location: {
            type: String,
            default: "unKnow",
        },
        inventory_stock: {
            type: Number,
            required: true,
        },
        inventory_shopId: {
            type: Schema.Types.ObjectId,
            ref: "shop",
        },
        inventory_reservation: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        currency: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
