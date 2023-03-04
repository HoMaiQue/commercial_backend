"use strict";
const {Schema, model} = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "shop";
const COLLECTION_NAME = "shops";
// Declare the Schema of the Mongo model
var shopSchema = Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["active", "inActive"],
            default: "inActive",
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        roles: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
