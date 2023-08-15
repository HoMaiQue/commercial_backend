"use strict";
const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: "Checkout review successfully",
            metaData: await CheckoutService.checkoutReview(req.body),
        }).send(res);
    };
    // getAllDiscountCodes = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "Success code found",
    //         metaData: await CheckoutService.getAllDiscountCodesByShop({
    //             ...req.query,
    //             shopId: req.user.userId,
    //         }),
    //     }).send(res);
    // };
    // getDiscountAmount = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "Get discount amount successfully",
    //         metaData: await CheckoutService.getDiscountAmount({
    //             ...req.body,
    //         }),
    //     }).send(res);
    // };
    // getAllDiscountWithProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: "get all discount with product successfully",
    //         metaData: await CheckoutService.getAllDiscountCodesWithProduct({
    //             ...req.query,
    //         }),
    //     }).send(res);
    // };
}
module.exports = new CheckoutController();
