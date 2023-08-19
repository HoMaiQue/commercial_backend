"use strict";
const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";
// Declare the Schema of the Mongo model
/**
 * ORDER-001: order successfully
 * ORDER-002: order failed
 * PROMOTION-001: New Promotion
 * SHOP-001: New Product by shop
 */
var notificationSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: ["ORDER-001", "ORDER-002", " PROMOTION-001", "SHOP-001"],
            require: true,
        },
        noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: "shop" },
        noti_receiverId: { type: Number, required: true },
        noti_content: { type: String, required: true },
        noti_options: { type: Object, default: {} },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
