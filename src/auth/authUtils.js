"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helper/asyncHandler");
const { findByUserId } = require("../services/keyToken.service");
const { AuthFailureError, NotFoundError } = require("../core/error.response");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "x-rtoken-id"
};
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // const accessToken = await JWT.sign(payload, privateKey, {
        //     // algorithm: "RS256",
        //     expiresIn: "2 days",
        // });
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: "RS256",
            expiresIn: "2 days",
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: "RS256",
            expiresIn: "7 days",
        });
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("error verify", err);
            } else {
                console.log(`verify success`, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    /* 
        1 check userId missing
        2 get accessToken
        3 verify token
        4 check user in db
        5 check keystore with this userId
        6 ok all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("invalid request");

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("not found keystore");
    // logout co the truyen accesstoken hoac refresh token

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("invalid request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError("invalid userId");
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
    /* 
        1 check userId missing
        2 get accessToken
        3 verify token
        4 check user in db
        5 check keystore with this userId
        6 ok all => return next()
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("invalid request");

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError("not found keystore");
    // logout co the truyen accesstoken hoac refresh token
    if(req.headers[HEADER.REFRESH_TOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) {
                throw new AuthFailureError("invalid userId");
            }
            
            req.keyStore = keyStore;
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("invalid request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError("invalid userId");
        }
        req.keyStore = keyStore;
        req.user = decodeUser
        return next();
    } catch (error) {
        throw error;
    }
});
const verifyJWT = async(token, keySecret)=> {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication, 
    verifyJWT,
    authenticationV2
};
