"use strict";
const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
    checkProductServer,
    checkProductByServer,
} = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ],
                },
                {
                    shopId,
                    shop_discounts: [{
                        shopId,
                        discountId,
                        codeId
                    }],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ], 
                }
            ]
        }   
    */
    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) {
            throw new BadRequestError("cart not exist");
        }
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        };
        const shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[i];
            //check product available
            const checkProductServer = await checkProductByServer(
                item_products
            );
            console.log(checkProductServer);
            if (!checkProductServer[0])
                throw new BadRequestError("order wrong");
            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            // tong tien truoc khi su ly
            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            };

            //neu shop discount ton tai va lon hon khong check co ton tai hay khong
            if (shop_discounts.length > 0) {
                //gia su chi co 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } =
                    await getDiscountAmount({
                        codeId: shop_discounts[0].codeId,
                        userId,
                        shopId,
                        products: checkProductServer,
                    });
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount;
                // neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }
            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

            shop_order_ids_new.push(itemCheckout);
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        };
    }
}

module.export = CheckoutService;
