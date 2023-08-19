"use strict";
const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
    getListNotification = async (req, res, next) => {
        new SuccessResponse({
            message: "get list notification successfully",
            metaData: await NotificationService.getListNotiByUser(req.query),
        }).send(res);
    };
}
module.exports = new NotificationController();
