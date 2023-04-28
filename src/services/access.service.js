"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const keyTokenModel = require("../models/keyToken.model");
const shopRoles = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};
class AccessService {

    static logout = async({keyStore})=> {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
    /* check email in db
       match password
       create accessToken vs RefreshToken and save
       generate token
       get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // refresh token khi user dang nhap lai ma da co cookie thi nen gan theo de xoa token trong db di de khoi truy van lai vao db
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("shop not registered");

        const match = bcrypt.compare(password, foundShop.password);
       
        if (!match) throw new BadRequestError("Authentication error");

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        const {_id: userId} = foundShop
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey,
            userId
        })
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    };
    static signUp = async ({ name, email, password }) => {
        // step1 check email exists
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError("Error: Shop already registered!");
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
                throw new BadRequestError("PublicKey error");
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
    };
}
module.exports = AccessService;
