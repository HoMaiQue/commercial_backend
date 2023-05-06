"use strict";

const keyTokenModel = require("../models/keyToken.model");
const {Types} = require("mongoose")
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
        try {
            // const publicKeyString = publicKey.toString();
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     // publicKey: publicKeyString,
            //     publicKey: publicKey,
            //     privateKey,
            // });
            // return tokens ? tokens.publicKey : "";

            //level xx
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken,
            };
            const options = {
                upsert: true,
                new: true,
            };
            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async(userId)=> {
        return keyTokenModel.findOne({user: Types.ObjectId(userId)})
    }

    static removeKeyById = async(id)=> {
        return await keyTokenModel.remove(id)
    }

    static findByRefreshTokenUsed = async(refreshToken)=> {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken}).lean()
    }
    static findByRefreshToken = async(refreshToken)=> {
        return await keyTokenModel.findOne({refreshToken})
    }
    static deleteKeyById = async(userId)=> {
        return await keyTokenModel.deleteOne({user: Types.ObjectId(userId)})
    }
}

module.exports = KeyTokenService;
