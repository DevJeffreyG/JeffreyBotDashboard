module.exports = (app) => {
    // Handle 500
    app.use(function (error, req, res, next) {
        res.status(500);
        res.render("./subpages/errors/500.ejs");
    });

    app.use(function (req, res, next) {
        res.status(404).render("./subpages/errors/404.ejs");
    })
}