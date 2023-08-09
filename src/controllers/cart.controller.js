"use strict";
const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new cart  success",
            metaData: await CartService.addToCart(req.body),
        }).send(res);
    };
    update = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart Success  found",
            metaData: await CartService.addCartV2 (req.body),
        }).send(res);
    };
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete cart successfully",
            metaData: await CartService.deleteUserCart(
                req.body,
            ),
        }).send(res);
    };
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "list cart successfully",
            metaData: await CartService.getListUserCart(
                req.query,
            ),
        }).send(res);
    };
}
module.exports = new CartController();
