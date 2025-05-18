const { PermissionsBitField, codeBlock, EmbedBuilder } = require("discord.js");
const Enums = require("../utils/Enums");
const Bases = {
    "devIds": [
        "437668432604037142", "460913577105293313"
    ]
};

const { Locale, Session } = require("../utils");
const { ValidateToken, Markdown, GenerateServerAuth, Encrypt, Decrypt } = require("../utils/Functions");

const superagent = require("superagent");
const Express = require("express")();
const ms = require("ms");
const jwt = require("jsonwebtoken");

const API_ENDPOINT = Session.API_ENDPOINT;
const REDIRECT_URI = Session.REDIRECT_URI;

const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS_VALUE}&scope=bot%20applications.commands`
const oauth2 = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=guilds+identify`;
const uptime = "https://stats.uptimerobot.com/oOR4JiDYNj";

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    const locale = new Locale(); // Create Locale
    const texts = locale.texts; // TODO

    /* ===== EXTERNAL LINKS ===== */
    app.get("/invite", (req, res) => { res.redirect(inviteLink + `&guild_id=${req.query.guildId}`) });
    app.get("/login", (req, res) => { res.redirect(oauth2) });
    app.get("/status", (req, res) => { res.redirect(uptime) });

    /* ===== FOOTER LINKS ===== */
    app.get(["/creator/", "/coloredstealth"], (req, res) => { prepare("./subpages/creator/coloredstealth", { req, res }) });
    app.get(["/creator/jeffrey", "/creator/developer", "/creator/jeff", "/developer"], (req, res) => { prepare("./subpages/creator/developer", { req, res }) });
    app.get(["/creator/projects", "/projects"], (req, res) => { prepare("./subpages/creator/projects", { req, res }) });
    app.get("/changelog", (req, res) => { prepare("./changelog", { req, res }) })
    app.get("/tos", (req, res) => { prepare("./tos", { req, res }) })
    app.get("/privacy", (req, res) => { prepare("./privacy", { req, res }) })

    /* ===== SOCIAL LINKS ===== */
    app.get(["/creator/discord", "/discord"], (req, res) => { res.redirect("https://discord.gg/fJvVgkN") });
    app.get(["/creator/youtube", "/youtube"], (req, res) => { res.redirect("https://www.youtube.com/@jeffrowo") });
    app.get(["/creator/twitter", "/creator/x", "/twitter", "/x"], (req, res) => { res.redirect("https://www.twitter.com/eljeffrowo") });
    app.get(["/creator/twitch", "/twitch"], (req, res) => { res.redirect("https://www.twitch.com/jeffrowo") });

    app.get(["/support/github", "/github"], (req, res) => { res.redirect("https://github.com/DevJeffreyG/JeffreyBot") });
    //app.get("/support/discord", (req, res) => { res.redirect(`https://discord.gg/${process.env.SUPPORT_INVITE}`) });

    /* ===== GENERAL LINKS ===== */
    app.get("/app-health", (req, res) => {
        return res.sendStatus(200)
    });
    app.get("/", (req, res) => prepare("home", { req, res }));

    app.get("/dashboard", (req, res) => { prepare("./dashboard", { req, res }) });
    app.get("/dashboard/*", (req, res) => { prepare("./dashboard", { req, res }) });
    app.get("/logout", (req, res) => logout(req, res));

    /* ===== API CALLS ===== */
    app.get("/refresh", async (req, res) => {
        //console.log("GET refresh", req.cookies);        
        const session = app.Sessions.getSession(req, res);

        let refreshed = await session.refreshToken(req, res);
        if (!refreshed) {
            res.clearCookie("refresh_cookie");
            return res.status(401).redirect(`/logout?redirect=${req.query.redirect ?? "/"}`);
        }

        let redirect = req.query.redirect.toString() ?? "/";
        redirect += `${redirect.match(/\?.*/) ? "&" : "?"}token=${encodeURIComponent(GenerateServerAuth(Math.random() * 500, 3))}`;

        console.log("refreshing, redirecting to...", redirect);
        return res.status(200).redirect(redirect);
    });

    app.get("/api/discord-callback", async (req, res) => {
        if (req.cookies.token) return res.status(401).redirect("/");
        const session = app.Sessions.getSession(req, res);
        const code = req.query.code;
        if (!code) return res.status(401)
            .redirect("/")

        // conseguir token
        const auth_query = await superagent.post(`${API_ENDPOINT}/oauth2/token`)
            .send({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI
            })
            .type("application/x-www-form-urlencoded")
            .catch(console.error);

        if (!auth_query || auth_query.badRequest) return res.sendStatus(401);

        const auth = auth_query.body;

        const user_query = await superagent.get(`${API_ENDPOINT}/users/@me`)
            .set("authorization", `${auth.token_type} ${auth.access_token}`);

        if (user_query.body.error) return res.status(400).send({
            error: { message: "couldn't get user", response: rawUser }
        })
        const rawUser = user_query.body;
        const refreshToken = jwt.sign({ refresh_token: auth.refresh_token, user_id: session.uuid }, process.env.TOKEN, { expiresIn: auth.expires_in })
        const user = jwt.sign({ rawUser }, process.env.TOKEN, { expiresIn: auth.expires_in })

        session.setToken(auth);
        session.setDiscordUser(rawUser)

        res.cookie("refresh_token", Encrypt(refreshToken), {
            httpOnly: true,
            secure: true,
            maxAge: auth.expires_in,
            sameSite: "strict",
            path: "/refresh"
        })

        session.startRefreshInterval(req);

        res.cookie("user", user, {
            httpOnly: true,
            secure: true,
            maxAge: auth.expires_in
        })
        if (req.query.redirect) return res.redirect(req.query.redirect)
        return res.redirect("/dashboard/")
    });
    app.get("/api/get-guild", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const guildId = req.header("guildid");
        const session = app.Sessions.getSession(req, res);

        if (!guildId) return res.status(400)
            .send({
                error: { message: "missing guildid" },
                status_code: 400
            });

        try {
            const query = await superagent.get(`${API_ENDPOINT}/guilds/${guildId}`)
                .set("authorization", `Bot ${process.env.TOKEN}`);

            const query_channels = await superagent.get(`${API_ENDPOINT}/guilds/${guildId}/channels`)
                .set("authorization", `Bot ${process.env.TOKEN}`)
                .catch(console.error);

            const guild = query.body;
            const channels = query_channels.body;

            if (guild.code === 50001) return res.status(400)
                .send({
                    error: { message: "client not in guild", response: guild },
                    status_code: 400
                })

            res.cookie(`fetchedGuild-${guild.id}`, guild.name, { maxAge: ms("5m") });

            session.addGuildInfo(guild, channels);

            res.send({ guild, channels });
        } catch (err) {
            console.log(err);
            res.status(300).send(false);
        }
    })
    app.get("/api/get-guilds", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const session = app.Sessions.getSession(req, res);

        const query = await superagent.get(`${API_ENDPOINT}/users/@me/guilds`)
            .set("authorization", `${session.token_type} ${session.token}`)
            .catch(console.error);

        try {
            const json = query.body;

            const result = json?.filter(x => {
                const permissions = new PermissionsBitField(x.permissions)
                const checkAgainst = new PermissionsBitField(PermissionsBitField.Flags.ManageGuild)

                if (permissions.has(checkAgainst)) return x;
            })

            res.send(result);
        } catch (err) {
            console.log(query)
            console.log(err)
        }
    })
    app.get("/api/check_guild_fetch", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const guildId = req.header("guildid");

        if (!guildId) return res.status(400)
            .send({
                error: { message: "missing guildid" },
                status_code: 400
            });

        res.send({ fetched: req.cookies[`fetchedGuild-${guildId}`] ? true : false });
    })
    app.get("/api/db/get-guild", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const guildId = req.header("guildid");

        if (!guildId) return res.status(500)
            .send({
                error: { message: "missing guildid" },
                status_code: 400
            });

        try {
            const query = await superagent
                .get(`${process.env.JeffreyBotEnd}/api/db/get-guild`)
                .set("guildId", guildId)
                .set("auth", GenerateServerAuth());

            res.send(query.body)
        } catch (err) {
            res.status(500).send(false);
        }
    })
    app.get("/api/db/get-changelogs", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        try {
            const query = await superagent
                .get(`${process.env.JeffreyBotEnd}/api/db/get-changelogs`)
                .set("auth", GenerateServerAuth())
                .catch(console.error);

            res.send(query.body);
        } catch (err) {
            res.status(500).send(false);
        }

    })
    app.get("/api/db/get-tos", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        try {
            const query = await superagent
                .get(`${process.env.JeffreyBotEnd}/api/db/get-tos`)
                .set("auth", GenerateServerAuth())
                .catch(console.error);

            res.send(query.body)
        } catch (err) {
            console.log(err);
            res.status(500).send(false);
        }
    })
    app.get("/api/guild/has-permissions", async (req, res) => {
        const session = app.Sessions.getSession(req, res);

        if (!session.token) return res.status(401).send({ message: "no auth found, relogging needed", statusCode: 401 });
        const guildId = req.header("guildid");

        const query = await superagent.get(`${API_ENDPOINT}/users/@me/guilds`)
            .set("authorization", `${session.token_type} ${session.token}`)
            .catch(console.error);

        const json = query.body;

        if (!json) res.send(true); // No se pudo fetchear

        try {
            const result = json?.filter(x => {
                const permissions = new PermissionsBitField(x.permissions)
                const checkAgainst = new PermissionsBitField(PermissionsBitField.Flags.ManageGuild)

                if (permissions.has(checkAgainst)) return x;
            })

            res.status(200).send(JSON.stringify(result.find(x => x.id === guildId) ?? { message: "not authorized", statusCode: 401 }));
        } catch (err) {
            console.log("⚠️", err);
        }
    })

    /**
     * Render page with req and res to prepare necessary vars
     * @param {String} toRender 
     * @param {{req, res}}
     * @returns 
     */
    function prepare(toRender, { req, res }) {
        const session = app.Sessions.getSession(req, res);

        const base = {
            texts,
            session,
            Enums,
            Bases,
            Markdown,
            req,
            res
        }

        for (const query in req.query) {
            base[query] = req.query[query]
        }

        return res.render(toRender, base)
    }

    function logout(req, res) {
        const session = app.Sessions.getSession(req, res);

        if (session.token || session.refresh) superagent.post(`${API_ENDPOINT}/oauth2/token/revoke`)
            .send({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                token: session.token || session.refresh
            })
            .type("application/x-www-form-urlencoded")
            .catch(console.error);

        app.Sessions.closeSession(session.uuid);

        res.clearCookie("uuid");
        res.clearCookie("user");

        for (const key of Object.entries(req.cookies)) {
            if (key[0].includes("fetchedGuild")) res.clearCookie(key[0]);
        }


        res.redirect(req.query.redirect)
    }
}