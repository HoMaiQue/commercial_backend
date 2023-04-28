
"use strict"
const asyncHandler = (fn) => {
    return (reg, res, next) => {
        fn(reg, res, next).catch(next);
    };
};

module.exports = asyncHandler;
