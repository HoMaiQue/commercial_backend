require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// express version 4  ho tro ue code nen khong can body parse
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
// init db
require("./dbs/init.mongodb");

//init router

app.use("/", require("./routes"));
// handle errors
app.use((reg, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, reg, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "Error",
        code: statusCode,
        stack: error.stack,
        message: error.message || "Internal Server Error",
    });
});
module.exports = app;
