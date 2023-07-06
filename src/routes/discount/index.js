"use strict";
const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
    "/list_product_code",
    asyncHandler(discountController.getAllDiscountWithProduct)
);

router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("/", asyncHandler(discountController.getAllDiscountCodes));


module.exports = router;
