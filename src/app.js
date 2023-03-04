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
// app.get("/", (reg, res, next) => {
//     return res.status(200).json({
//         message: "xin chao",
//     });
// });
app.use("/", require("./routes"));
// handle errors

module.exports = app;
