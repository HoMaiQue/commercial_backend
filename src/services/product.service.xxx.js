"use strict";

const { BadRequestError } = require("../core/error.response");
const {
    clothing,
    product,
    electronic,
    furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo");

const { removeUndefinedObject, updateNestedObject } = require("../utils");
// define factory class

class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("invalid type");
        return new productClass(payload).createProduct();
    }
    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError("invalid type");
        return new productClass(payload).updateProduct(product_id);
    }
    /**
     * 
     */
    /**
     * @desc get all draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @returns {JSON}
     */
    // get a list of the seller's draft
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async getListSearchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }
    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = "1",
        filter = { isPublished: true },
    }) {
        return await findAllProducts({
            limit,
            sort,
            filter,
            page,
            select: ["product_name", "product_price", "product_thumb"],
        });
    }
    static async findProduct({ product_id }) {
        return await findProduct({
            product_id,
            unSelect: ["__v"],
        });
    }

    // put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
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
        const newProduct = await product.create({ ...this, _id: product_id });
        if (newProduct) {
            await insertInventory({
                product_id: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            });
        }
        return newProduct;
    }
    async updateProduct(product_id, payload) {
        return await updateProductById({ product_id, payload, model: product });
    }
}
// define sub-class for type clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newClothing)
            throw new BadRequestError("create new clothing error");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct;
    }

    async updateProduct(product_id) {
        /**
         * 1. remove attribute has null and undefined
         * 2. check xem update o dau ?
         */
        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            await updateProductById({
                product_id,
                payload: updateNestedObject(objectParams.product_attributes),
                model: clothing,
            });
        }
        const updateProduct = await super.updateProduct(
            product_id,
            updateNestedObject(objectParams)
        );
        return updateProduct;
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic)
            throw new BadRequestError("create new electronic error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct;
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture)
            throw new BadRequestError("create new Furniture error");

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("create new product error");
        return newProduct;
    }
}

// register product type

ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
