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
const { getProductById } = require("../models/repositories/product.repo");
class CartService {
    static async createCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: "active" };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        };
        const options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateQuantityCartProduct({ userId, product }) {
        const { productId, quantity } = product;
        const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: "active",
        };
        const updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        };
        const options = { upsert: true, new: true };
        return await cart.findOneAndUpdate(query, updateSet, options);
    }
    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ userId: userId });
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

    /**
     * update cart
     * shop_order_ids: [
     *      {
     *          shopId,
     *          itemsProducts: [
     *          {
     *               quantity,
     *               price,
     *               shopId,
     *               old_quantity,
     *               product_id
     *          }
     *          ]
     *          version
     *      }
     * ]
     */
    static async addCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];

        const foundProduct = await getProductById(productId);
        if (!foundProduct) {
            throw new NotFoundError("Product not exits");
        }
       
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
            throw new NotFoundError("Product dose not belong to the shop");
        }

        if (quantity === 0) {
        }

        return await CartService.updateQuantityCartProduct({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        });
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" };
        const updateSet = {
            $pull: { cart_products: { productId } },
        };
        return cart.updateOne(query, updateSet);
    }
    static async getListUserCart({ userId }) {
        return await cart.findOne({ cart_userId: userId }).lean();
    }
}

module.exports = CartService;
