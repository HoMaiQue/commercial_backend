"use strict";
/* 
    cart service
    1 add product to cart [user]
    2 reduce product quantity by one [user]
    3 increase product quantity by one [user]
    4 get cart
    5 Delete cart
    5 Cancel cart item [users]
*/
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertToObjectIdMongodb } = require("../utils");
const cart = require("../models/cart.model");
const { findAllProducts } = require("./product.service.xxx");
const {
    findAllDiscountCodesUnselect,
    checkDiscountExist,
} = require("../models/repositories/discount.repo");
class CartService {
    static async createCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product,
                },
            };
        options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateQuantityCartProduct({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
                cart_userId: userId,
                "cart_products.productId": productId,
                cart_state: "active",
            },
            updateSet = {
                $inc: {
                    "cart_products.$.quantity": quantity,
                },
            };
        options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateSet, options);
    }
    static async addToCart({ userId, product: {} }) {
        const userCart = await cart.findOne({ userId: userId }).lean();
        if (!userCart) {
            //create cart
            return await CartService.createCart({ userId, product });
        }
        // neu co gio hang ma chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }
        // neu ma gio hang ton tai va co san pham nay thi update quantity
        return await CartService.updateQuantityCartProduct({ userId, product });
    }
}

module.exports = CartService;
