"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) {
            delete obj[key];
        }
    });
    return obj;
};
const updateNestedObject = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const res = updateNestedObject(obj[key]);
            Object.keys(res).forEach((k) => {
                final[`${key}.${k}`] = res[k];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObject,
};
