"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // const publicKeyString = publicKey.toString();
            const tokens = await keyTokenModel.create({
                user: userId,
                // publicKey: publicKeyString,
                publicKey: publicKey,
                privateKey,
            });
            return tokens ? tokens.publicKey : "";
        } catch (error) {
            return error;
        }
    };
}

module.exports = KeyTokenService;
