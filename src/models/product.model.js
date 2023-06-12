"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
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
        product_slug: String, //quan-jean
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
        product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        // more
        product_ratings: {
            type: Number,
            default: 4.5,
            min: [1.0, "Rating must be above 1.0"],
            max: [5.0, "Rating must be below 5.0"],
            set: (value) => Math.round(value * 10) / 10,
        },
        // product variation
        product_variations: {
            type: Array,
            default: [],
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },

        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);
// create index for search
productSchema.index({ product_name: "text", product_description: "text" });
// Document middleware: run before .save() and .create()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});
// defined the product type  = clothing
const clothingSchema = Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
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
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);
const furnitureSchema = Schema(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
        collection: "furnitures",
        timestamps: true,
    }
);

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model("Clothing", clothingSchema),
    electronic: model("Electronic", electronicSchema),
    furniture: model("Furniture", furnitureSchema),
};
