"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const shopRoles = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1 check email exists
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    status: "xxx",
                    message: "Email already registered",
                };
            }
            const passwordHash = await bcrypt.hash(password, 10);
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
                // const { privateKey, publicKey } = crypto.generateKeyPairSync(
                //     "rsa",
                //     {
                //         modulusLength: 4096,
                //         publicKeyEncoding: {
                //             type: "pkcs1",
                //             format: "pem",
                //         },
                //         privateKeyEncoding: {
                //             type: "pkcs1",
                //             format: "pem",
                //         },
                //     }
                // );
                // cách thuong hay dung v2
                const privateKey = crypto.randomBytes(64).toString("hex");
                const publicKey = crypto.randomBytes(64).toString("hex");

                // const publicKeyString = await KeyTokenService.createKeyToken({
                //     userId: newShop._id,
                //     publicKey,
                // });

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                // if (!publicKeyString) {
                //     return {
                //         code: "xxxx",
                //         message: "PublicKey error",
                //     };
                // }
                if (!keyStore) {
                    return {
                        code: "xxxx",
                        message: "PublicKey error",
                    };
                }
                // const publicKeyObject = crypto.createPublicKey(publicKeyString);
                // const tokens = await createTokenPair(
                //     { userId: newShop._id, email },
                //     publicKeyObject,
                //     privateKey
                // );

                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKey,
                    privateKey
                );
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ["_id", "name", "email"],
                            object: newShop,
                        }),
                        tokens,
                    },
                };
            }
            return {
                code: 200,
                metadata: null,
            };
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
