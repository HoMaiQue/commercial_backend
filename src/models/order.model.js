"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";
// Declare the Schema of the Mongo model
var OrderSchema = Schema(
    {
        order_user: {
            type: Number,
            required: true,
        },
        order_checkout: {
            type: Object,
            default: {},
            /**
             * order_checkout: {
             *     totalPrice,
             *     totalApplyDiscount,
             *      feeship
             * }
             */
        },
        order_shipping: {
            type: Object,
            default: {},
            /**
             * order_shipping: {
             *     street,
             *     city,
             *     state,
             *     country
             * }
             */
        },
        order_payment: {
            type: Object,
            default: {},
        },
        order_products: {
            type: Array,
            required: true,
        },
        order_trackingNumber: {
            type: String,
            default: "#000118052022",
        },
        order_status: {
            type: String,
            enum: ["pending", "confirmed", "ship", "cancel", "delivered"],
            default: "pending",
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, OrderSchema);
