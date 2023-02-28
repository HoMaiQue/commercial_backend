"use strict";

const dev = {
    app: {
        port: process.env.DEV_ENV_PORT || 3000,
    },
    db: {
        host: process.env.DEV_ENV_HOST || "127.0.0.1",
        port: process.env.DEV_ENV_PORT || "27017",
        name: process.env.DEV_ENV_NAME || "shopDev",
    },
};

const pro = {
    app: {
        port: process.env.PRO_ENV_PORT || 3000,
    },
    db: {
        host: process.env.PRO_ENV_HOST || "127.0.0.1",
        port: process.env.PRO_ENV_PORT || "27017",
        name: process.env.PRO_ENV_NAME || "shopDev",
    },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
