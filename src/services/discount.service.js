"use strict";
/* 
    discount service
    1 Generate discount code [shop |admin]
    2 Get discount amount
    3 Get all discount codes [Users |shop]
    4 Verify discount code [users ]
    5 Delete discount code [Admin | shop]
    5 Cancel discount code [users]
*/
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const discount = require("../models/discount.model");
const { findAllProducts } = require("./product.service.xxx");
const {
    findAllDiscountCodesUnselect,
    checkDiscountExist,
} = require("../models/repositories/discount.repo");
class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;
        // if (
        //     new Date() < new Date(start_date) ||
        //     new Date() > new Date(end_date)
        // )
        //     throw new BadRequestError("Discount code has expires");
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date");
        }
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean();
        if (foundDiscount && foundDiscount.discount_isActive) {
            throw new BadRequestError("Discount exits");
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_isActive: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });

        return newDiscount;
    }

    static async updateDiscountCode() {}
    // get all discount code available with product
    static async getAllDiscountCodesWithProduct({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean();

        if (!foundDiscount || !foundDiscount.discount_isActive) {
            throw new NotFoundError("discount not exists");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }
        return products;
    }

    // get all discount code of shop
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_isActive: true,
            },
            unSelect: ["__v", "discount_shopId"],
            model: discount,
        });
        return discounts;
    }

    /* apply discount code
        products = [
            {productId, shopId, quantity, name, price },
            {productId, shopId, quantity, name, price }
        ]
    */
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundShop = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });
        if (!foundShop) throw new NotFoundError("Discount does not exist");

        const {
            discount_isActive,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundShop;

        if (!discount_isActive) throw new NotFoundError("Discount expired");
        if (!discount_max_uses) throw new NotFoundError("Discount are out");

        // if (
        //     new Date() < new Date(discount_start_date) ||
        //     new Date() > new Date(discount_end_date)
        // )
        //     throw new NotFoundError("Discount code has expired");

        // check gia tri toi thieu
        let orderTotal = 0;
        if (discount_min_order_value > 0) {
            orderTotal = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);
        }
        if (orderTotal > discount_min_order_value) {
            throw new NotFoundError("discount requires a minimum value ");
        }

        if (discount_max_uses_per_user > 0) {
            const useUserDiscount = discount_users_used.find(
                (user) => user.userId === userId
            );

            if (useUserDiscount) {
            }
        }

        // check xem discount nay la fix_mount
        const amount =
            discount_type === "fixed"
                ? discount_value
                : orderTotal * (discount_value / 100);

        return {
            orderTotal,
            discount: amount,
            totalPrice: orderTotal - amount,
        };
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        // nên làm kiểm tra discount code có sử dụng ở đâu hay không
        // nên tạo thêm 1 table xóa chứ không nên xóa luôn hay dùng field isDelete vì sẻ tốn index

        /* nên tìm foundDiscount trước khi xóa 
        if(foundDiscount){
            do something
}*/
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });

        return deleted;
    }
    // cancel discount code
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundShop = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });
        if (!foundShop) throw new NotFoundError("Discount does not exist");

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_users_used: 1,
                discount_uses_count: -1,
            },
        });
        return result;
    }
}

module.exports = DiscountService;
