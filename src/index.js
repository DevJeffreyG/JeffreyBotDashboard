require("dotenv").config();
const express = require("express");

// express
const app = express();

const { webRoutes, postHandler, errorHandler, middlewares } = require("./web");
const { SessionManager } = require("./utils");

app.Sessions = new SessionManager();

try {
    middlewares(app);
    webRoutes(app);
    postHandler(app);
    errorHandler(app);
} catch (err) {
    console.error(err);
}

app.listen(app.get("port"), () => console.log("🟢 Using port", app.get("port")));