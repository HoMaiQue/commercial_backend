"use strict";
const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
router.post("/amount", asyncHandler(cartController.getDiscountAmount));
router.get(
    "/list_product_code",
    asyncHandler(cartController.getAllDiscountWithProduct)
);

router.use(authenticationV2);

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.listToCart));


module.exports = router;
