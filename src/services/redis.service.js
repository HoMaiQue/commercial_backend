"use strict";
const { promisify } = require("util"); //nhiemj vu  chuyen 1 ham thanh 1 ham async await
const redis = require("redis");
const {
    reservationInventory,
} = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
// neu k ton tai thi set ma  ton tai thi khong set
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
//khoa lac quan
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    /* khi ai vao mua san pham thi no se tao 1 key dua cho nguoi di truoc, nguoi di truoc di
        dat hang xong tru ton kho xong thi tra lai key de cho nguoi khac vao 
        thuat toan acquireLock lock khoa bi quan va lac quan 

    */
    // neu nguoi ta chua lay duoc thi cho, cho nguoi ta cho bao nhieu lan
    const retryTimes = 10;
    // thoi gian tam lock
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
        // tao 1 key, thang nao nam giu vao thanh toan
        const result = await setnxAsync(key, expireTime);
        // key nay neu chua ai giu thi cap tra ve 1 con giu roi tra ve 0
        console.log(`result:::`, result);
        if (result === 1) {
            // thao tac voi eventory
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId,
            });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve, reject) => {
                setTimeout(resolve, 50);
            });
        }
    }
};

const releaseLock = async (keyLock) => {
    const deAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await deAsyncKey(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock,
};
