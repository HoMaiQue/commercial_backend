"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        new Created({
            message: "Register Ok",
            metaData: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };

    logIn = async (req, res, next) => {
        new SuccessResponse({
            metaData: await AccessService.login(req.body),
        }).send(res);
    };
}
module.exports = new AccessController();
