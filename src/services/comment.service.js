"use strict";
const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { findProduct } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");
/**
 * key feature
 * 1 add comment [User | shop]
 * 2 get list comment [User | shop]
 * 3 delete comment [User | shop | admin]
 */
class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentCommentId = null,
    }) {
        const foundProduct = await findProduct({ product_id: productId });
        if (!foundProduct) throw new NotFoundError("Product not found");
        const comment = new Comment({
            comment_productId: productId,
            comment_content: content,
            comment_userId: userId,
            comment_parentId: parentCommentId,
        });

        let rightValue;
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment)
                throw new NotFoundError("parent comment not found");

            rightValue = parentComment.comment_right;

            await this.incrementCommentValues(productId, rightValue, 2);
            //update many comment
            // await Comment.updateMany(
            //     {
            //         comment_productId: convertToObjectIdMongodb(productId),
            //         comment_right: { $gte: rightValue },
            //     },
            //     { $inc: { comment_right: 2 } }
            // );

            // await Comment.updateMany(
            //     {
            //         comment_productId: convertToObjectIdMongodb(productId),
            //         comment_left: { $gt: rightValue },
            //     },
            //     { $inc: { comment_left: 2 } }
            // );
        } else {
            const maxRightValue = await Comment.findOne(
                {
                    comment_productId: convertToObjectIdMongodb(productId),
                },
                "comment_right",
                { sort: { comment_right: -1 } }
            );
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;
        await comment.save();
        return comment;
    }
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0,
    }) {
        let query;
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) {
                throw new NotFoundError("Not found comment for product");
            }
            query = {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right },
            };
        } else {
            query = {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_parentId: parentCommentId,
            };
        }
        const comments = await Comment.find(query)
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1,
            })
            .sort({
                comment_left: 1,
            });
        return comments;
    }
    static async deleteComment({ productId, commentId }) {
        const foundProduct = await findProduct({ product_id: productId });
        if (!foundProduct) throw new NotFoundError("Product not found");

        const comment = await Comment.findById(commentId);
        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;

        const width = rightValue - leftValue + 1;

        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue },
        });

        await this.decrementCommentValues(productId, rightValue, width);
        // await Comment.updateMany(
        //     {
        //         comment_productId: convertToObjectIdMongodb(productId),
        //         comment_right: { $gt: rightValue },
        //     },
        //     {
        //         $inc: { comment_right: -width },
        //     }
        // );
        // await Comment.updateMany(
        //     {
        //         comment_productId: convertToObjectIdMongodb(productId),
        //         comment_left: { $gt: rightValue },
        //     },
        //     {
        //         $inc: { comment_left: -width },
        //     }
        // );
        return true;
    }

    static async incrementCommentValues(productId, startValue, amount) {
        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: startValue },
            },
            { $inc: { comment_right: amount } }
        );

        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: startValue },
            },
            { $inc: { comment_left: amount } }
        );
    }

    static async decrementCommentValues(productId, startValue, amount) {
        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gt: startValue },
            },
            { $inc: { comment_right: -amount } }
        );

        await Comment.updateMany(
            {
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: startValue },
            },
            { $inc: { comment_left: -amount } }
        );
    }
}

module.exports = CommentService;


/**
 *              comment
 *          cmt 1.1      cmt1.2
 *      cmt 1.1.1          cmt 1.1.2  
 * 
 */         

