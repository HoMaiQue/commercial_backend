"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopRoles = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};
class AccessService {
    static signUp = async ([name, email, password]) => {
        try {
            // step1 check email exists
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    status: "xxx",
                    message: "Email already registered",
                };
            }
            const passwordHash = await bcrypt(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [shopRoles.SHOP],
            });

            if (newShop) {
                //create privateKey and publicKey: không lưu private key vào trong hệ thống chỉ lưu public key vào
                // private key dùng để sign token
                //public key dùng để verify token
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                    }
                );
                console.log("private key", privateKey, "public key", publicKey);
            }
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}
module.exports = AccessService;
