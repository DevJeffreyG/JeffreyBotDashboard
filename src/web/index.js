const webRoutes = require("./webRoutes")
const postHandler = require("./postHandler")
const errorHandler = require("./errorHandler")
const middlewares = require("./middlewares")

module.exports = {
    middlewares,
    webRoutes,
    postHandler,
    errorHandler
}