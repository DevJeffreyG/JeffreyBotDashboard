const jwt = require("jsonwebtoken");
const path = require("path");
const express = require("express");

const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const { RefreshToken, ValidateToken } = require("../utils/Functions");

module.exports = (app) => {
    app.set("root", path.join(__dirname, "../views"));
    app.set("port", process.env.PORT || 10000);

    app.set("views", app.get("root"));
    app.set("view engine", "ejs");
    app.set('trust proxy', true)

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());

    app.use(express.static(app.get("root")));
    app.use("/static", express.static(path.join(__dirname, "../static/")));

    app.use((req, res, next) => {
        console.log("----------------- " + req.originalUrl + " -----------------");
        if (!req.cookies.token) {
            console.log("UNABLE TO FIND CONTROL TOKEN, GENERATING");
            RefreshToken(res);
        } else {
            ValidateToken(req, res, false);
        }

        next();
    })

    app.use((req, res, next) => {
        const session = app.Sessions.getSession(req, res);

        // Hay un usuario, pero no está en la Session (la app se reinició, se crasheó, etc)
        if (!session.discord_user && req.cookies.user) {
            //console.log(req.cookies);
            console.log("Recuperando Session");
            try {
                const user = jwt.verify(req.cookies.user, process.env.TOKEN)?.rawUser;
                session.setDiscordUser(user)

                console.log("SESSION OK");
            } catch (err) {
                console.log(err);
            }

            console.log("RETRIEVING ACCESS");

            return res.redirect(`/refresh?redirect=${req.url}`)
        }

        console.log("pending cookieupdate:", session.pendingCookieUpdate);

        // Si hay un usuario de discord, y la cookie refresh no existe o no hay autenticación
        if (session.refresh && session.pendingCookieUpdate)
            session.updateRefreshCookie(res);

        next()
    });
}