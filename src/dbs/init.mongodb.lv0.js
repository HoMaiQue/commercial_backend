// "use strict";
const mongoose = require("mongoose");
const connectString = "mongodb://127.0.0.1:27017/shopDev";
mongoose
    .connect(connectString)
    .then((_) => console.log("Connected MongoDB Success"))
    .catch((e) => console.log("Error Connect"));
// dev 
if(1 === 1){
    mongoose.set("debug", true)
    mongoose.set("debug", {color: true})
}
module.exports = mongoose