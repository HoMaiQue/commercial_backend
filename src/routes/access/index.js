"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const router = express.Router();

router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.logIn));

// authentication
router.use(authentication)
router.post("/shop/logout", asyncHandler(accessController.logout));


module.exports = router;
