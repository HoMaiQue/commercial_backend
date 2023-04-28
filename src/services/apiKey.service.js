"use strict";

const apiKeysModel = require("../models/apiKeys.model");
const crypto = require("crypto");
const findById = async (key) => {
    // const create = await apiKeysModel
    //     .create({
    //         key: crypto.randomBytes(64).toString("hex"),
    //         permissions: ["000"],
    //     })

    const objectKey = await apiKeysModel.findOne({ key, status: true }).lean();
    return objectKey;
};


module.exports = { findById };
