"use strict";
const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const productController = require("../../controllers/product.controller");
const router = express.Router();
router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProduct)
);
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

router.use(authenticationV2);
router.post("", asyncHandler(productController.createProduct));
router.patch("/:product_id", asyncHandler(productController.updateProductById));
router.post(
    "/publish/:id",
    asyncHandler(productController.publishProductByShop)
);
router.post(
    "/unpublish/:id",
    asyncHandler(productController.unPublishProductByShop)
);
// query
router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
