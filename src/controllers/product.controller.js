"use strict";
const { SuccessResponse } = require("../core/success.response");
// const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new product success",
            metaData: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "publishProductByShop success",
            metaData: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublishProductByShop success",
            metaData: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };

    // query

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list success",
            metaData: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "get list success",
            metaData: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "getListSearchProduct success",
            metaData: await ProductServiceV2.getListSearchProduct(req.params),
        }).send(res);
    };
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "findAllProducts success",
            metaData: await ProductServiceV2.findAllProducts(req.query),
        }).send(res);
    };
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "findProduct success",
            metaData: await ProductServiceV2.findProduct({product_id: req.params.product_id}),
        }).send(res);
    };

    // end query
}
module.exports = new ProductController();
