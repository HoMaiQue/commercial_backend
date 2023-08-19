"use strict";
const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "create comment successfully",
            metaData: await CommentService.createComment(req.body),
        }).send(res);
    };
    getListComment = async (req, res, next) => {
        new SuccessResponse({
            message: "create comment successfully",
            metaData: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    };
    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "delete comment successfully",
            metaData: await CommentService.deleteComment(req.body),
        }).send(res);
    };
}
module.exports = new CommentController();
