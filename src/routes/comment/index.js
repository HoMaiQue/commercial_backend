"use strict";
const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils");
const asyncHandler = require("../../helper/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

router.use(authenticationV2);

router.post("", asyncHandler(commentController.createComment));
router.get("", asyncHandler(commentController.getListComment));
router.delete("", asyncHandler(commentController.deleteComment));

module.exports = router;
