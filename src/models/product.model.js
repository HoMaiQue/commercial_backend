"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";
// Declare the Schema of the Mongo model
var productSchema = Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: {type: Schema.Types.ObjectId, ref: 'shop'},
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);
// defined the product type  = clothing
const clothingSchema = Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: {type: Schema.Types.ObjectId, ref: "Shop"}

    },
    {
        collection: "clothes",
        timestamps: true,
    }
);
// defined the product type  = electronic
const electronicSchema = Schema(
    {
        manufacturer: { type: String, required: true },
        model: String,
        color: String,
        product_shop: {type: Schema.Types.ObjectId, ref: "Shop"}
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);
//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronic", electronicSchema),
};
