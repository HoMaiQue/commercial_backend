"use strict";
const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();
router.post("/review", asyncHandler(checkoutController.checkoutReview));

// router.use(authenticationV2);

module.exports = router;
