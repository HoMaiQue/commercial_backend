"use strict";

const { BadRequestError } = require("../core/error.response");
const { clothing, product, electronic } = require("../models/product.model");

// define factory class

class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Clothing":
                return new Clothing(payload).createProduct();
            case "Electronic":
                return new Electronic(payload).createProduct();

            default:
                throw new BadRequestError("invalid type");
        }
    }
}
// define base Product

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product

    async createProduct(product_id) {
        return await product.create({...this,_id: product_id});
    }
}
// define sub-class for type clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({...this.product_attributes, product_shop:this.product_shop});

        if (!newClothing)
            throw new BadRequestError("create new clothing error");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct;
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({...this.product_attributes, product_shop:this.product_shop});

        if (!newElectronic)
            throw new BadRequestError("create new electronic error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct;
    }
}
module.exports = ProductFactory;
