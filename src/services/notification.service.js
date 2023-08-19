"use strict";
const Noti = require("../models/notification.model");
class NotificationService {
    static async pushNotiToSystem({
        type = "SHOP-001",
        receiveId = 1,
        senderId = 1,
        options = {},
    }) {
        let noti_content;

        if (type === "SHOP-001") {
            noti_content = `@@@ Vừa mới thêm một sản phẩm @@@@`;
        } else if (type === "PROMOTION-001") {
            noti_content = `@@@ Vừa mới thêm một voucher @@@@@`;
        }

        const newNoti = await Noti.create({
            noti_type: type,
            noti_content: noti_content,
            noti_receiverId: receiveId,
            noti_senderId: senderId,
            noti_options: options,
        });
        return newNoti;
    }

    static async getListNotiByUser({ type = "ALL", userId = 1, isRead = 0 }) {
        const match = { noti_receiverId: userId };
        if (type !== "ALL") {
            match["noti_type"] = type;
        }

        return await Noti.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receiverId: 1,
                    noti_content: 1,
                    createdAt: 1,
                    noti_options: 1
                },
            },
        ]);
    }
}
module.exports = NotificationService;
