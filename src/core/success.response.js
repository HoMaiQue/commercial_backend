"use strict";

const StatusCode = {
    OK: "200",
    CREATED: "201",
};
const ReasonStatusCode = {
    OK: "Success",
    CREATED: "Created",
};
class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        metaData = {},
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metaData = metaData;
    }
    send(res, headers = {}) {
        res.status(this.status).json(this);
    }
}
class Ok extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, metaData });
    }
}

class Created extends SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.CREATED,
        reasonStatusCode = ReasonStatusCode.CREATED,
        metaData,
        options,
    }) {
        super({ message, statusCode, reasonStatusCode, metaData });
        this.options = options;
    }
}

module.exports = {
    Ok,
    Created,
    SuccessResponse
};
