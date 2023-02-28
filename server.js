// init port, network and start

const app = require("./src/app");

const PORT = process.env.PORT || 3055;
const server = app.listen(PORT, () => {
    console.log("WSV commercial start with port " + PORT);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Exits Server Express"));
});
