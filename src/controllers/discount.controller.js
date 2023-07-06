"use strict";
const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new discount code success",
            metaData: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: "Success code found",
            metaData: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount amount successfully",
            metaData: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };
    getAllDiscountWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "get all discount with product successfully",
            metaData: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            }),
        }).send(res);
    };
}
module.exports = new DiscountController();
