const { PermissionsBitField, codeBlock, EmbedBuilder } = require("discord.js");
const Enums = require("../../../src/Enums");
const Bases = {
    "devIds": [
        "437668432604037142", "460913577105293313"
    ]
};

const { Locale, Session } = require("../utils");
const { ValidateToken, Markdown } = require("../../../src/Functions");

const superagent = require("superagent");
const Express = require("express")();
const ms = require("ms");
const jwt = require("jsonwebtoken");

const API_ENDPOINT = "https://discord.com/api/v10";
const REDIRECT_URI = `${process.env.HOME_PAGE}/api/discord-callback`;

const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS_VALUE}&scope=bot%20applications.commands`
const oauth2 = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20email%20guilds`;
const uptime = "https://stats.uptimerobot.com/oOR4JiDYNj";

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    var session = app.Session; // Get Session
    const locale = new Locale(); // Create Locale
    const texts = locale.texts; // todo

    /* ===== EXTERNAL LINKS ===== */
    app.get("/invite", (req, res) => { res.redirect(inviteLink + `&guild_id=${req.query.guildId}`) });
    app.get("/login", (req, res) => { res.redirect(oauth2) });
    app.get("/status", (req, res) => { res.redirect(uptime) });

    /* ===== FOOTER LINKS ===== */
    app.get("/creator/", (req, res) => { prepare("./subpages/creator/", { req, res }) });
    app.get("/creator/jeffreyg", (req, res) => { prepare("./subpages/creator/jeffreyg", { req, res }) });
    app.get("/creator/projects", (req, res) => { prepare("./subpages/creator/projects", { req, res }) });

    app.get("/creator/projects", (req, res) => { prepare("./subpages/creator/projects", { req, res }) });

    app.get("/changelog", (req, res) => { prepare("./changelog", { req, res }) })
    app.get("/tos", (req, res) => { prepare("./tos", { req, res }) })
    app.get("/privacy", (req, res) => { prepare("./privacy", { req, res }) })

    /* ===== SOCIAL LINKS ===== */
    app.get("/creator/discord", (req, res) => { res.redirect("https://discord.gg/fJvVgkN") });
    app.get("/creator/youtube", (req, res) => { res.redirect("https://www.youtube.com/JeffreyG") });
    app.get("/creator/twitter", (req, res) => { res.redirect("https://www.twitter.com/fakeJeffreyG") });

    app.get("/support/github", (req, res) => { res.redirect("https://github.com/DevJeffreyG/JeffreyBot") });
    app.get("/support/discord", (req, res) => { res.redirect(`https://discord.gg/${process.env.SUPPORT_INVITE}`) });

    /* ===== GENERAL LINKS ===== */
    app.get("/app-health", (req, res) => {
        let client = require("../../../index");

        if (client.readyAt) return res.sendStatus(200)
        return res.sendStatus(503)
    });
    app.get("/", (req, res) => {
        const token = jwt.sign({ ip: req.ip }, process.env.TOKEN, { expiresIn: "30m" });
        res.cookie("token", token);

        prepare("home", { req, res })
    });

    app.get("/dashboard", (req, res) => { prepare("./dashboard", { req, res }) });
    app.get("/dashboard/*/", (req, res) => { prepare("./dashboard", { req, res }) });
    app.get("/logout", (req, res) => {
        res.clearCookie("user");

        for (const key of Object.entries(req.cookies)) {
            if (key.includes("fetchedGuild")) res.clearCookie(key);
        }

        app.Session = new Session();
        session = app.Session;
        res.redirect("/")
    });

    /* ===== API CALLS ===== */
    app.get("/api/discord-callback", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        const code = req.query.code;

        if (!code) return res.status(400)
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

        if (!auth_query) return res.status(500);

        const auth = auth_query.body;

        const user_query = await superagent.get(`${API_ENDPOINT}/users/@me`)
            .set("authorization", `${auth.token_type} ${auth.access_token}`);

        const user = user_query.body;
        if (user.error) return res.status(400).send({
            error: { message: "couldn't get user", response: user }
        })

        session.setToken(auth);
        session.setDiscordUser(user)

        await getUserGuilds();

        res.cookie("user", user)
        res.redirect("/dashboard/")
    });
    app.get("/api/get-guild", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        const guildId = req.header("guildid");

        if (!guildId) return res.status(500)
            .send({
                error: { message: "missing guildid" },
                status_code: 400
            });

        try {
            const query = await superagent.get(`${API_ENDPOINT}/guilds/${guildId}`)
                .set("authorization", `Bot ${process.env.TOKEN}`);

            const query_channels = await superagent.get(`${API_ENDPOINT}/guilds/${guildId}/channels`)
                .set("authorization", `Bot ${process.env.TOKEN}`);

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
            res.status(300).send(false);
        }
    })
    app.get("/api/sendlog", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        let channelId = req.header("channelid");
        let changes = req.header("changes");
        let page = req.header("page");
        let executor = req.cookies.user;

        let embed = new EmbedBuilder()
            .setTitle(`Cambios en la configuración`)
            .setDescription(`**—** **${executor.username}** hizo cambios en la configuración del bot.
**—** En la Dashboard.
**—** Lo que se guardó: ${codeBlock("json", JSON.parse(changes))}
**—** En qué sección se hizo: \`${page}\`.`)
            .setColor("#00ff00")
            .setTimestamp();

        const sendQuery = await superagent.post(`${API_ENDPOINT}/channels/${channelId}/messages`)
            .send(JSON.stringify({ embeds: [embed.data] }))
            .type("application/json")
            .set("authorization", `Bot ${process.env.TOKEN}`);

        let response = sendQuery.body;
        res.send(response)
    })
    app.get("/api/db/get-guild", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
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
                .set("auth", req.cookies.token);

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
                .set("auth", req.cookies.token);

            res.send(query.body);
        } catch (err) {
            res.status(500).send(false);
        }

    })
    app.get("/api/db/get-tos", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        try {
            const query = await superagent
                .get(`${process.env.JeffreyBotEnd}/api/db/get-tos`)
                .set("auth", req.cookies.token);

            res.send(query.body)
        } catch (err) {
            res.status(500).send(false);
        }
    })
    app.get("/api/guild/has-permissions", async (req, res) => {
        if (!session.token) return res.status(500);
        const guildId = req.header("guildid");

        const query = await superagent.get(`${API_ENDPOINT}/users/@me/guilds`)
            .set("authorization", `${session.token_type} ${session.token}`);

        const json = query.body;

        if (!json) res.send(true); // No se pudo fetchear

        try {
            const result = json?.filter(x => {
                const permissions = new PermissionsBitField(x.permissions)
                const checkAgainst = new PermissionsBitField(PermissionsBitField.Flags.ManageGuild)

                if (permissions.has(checkAgainst)) return x;
            })

            res.send(JSON.stringify(result.find(x => x.id === guildId) ?? false));
        } catch (err) {
            console.log("⚠️", err);
        }
    })

    /* ===== ERRORS ===== */
    //app.get("/404/", (req, res) => { prepare("./subpages/errors/404", { req, res } )});

    /**
     * Render page with req and res to prepare necessary vars
     * @param {String} toRender 
     * @param {{req, res}}
     * @returns 
     */
    function prepare(toRender, { req, res }) {
        session.setCookies(req);

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

    /**
     * Get Guilds of User and set them to Session
     */
    async function getUserGuilds() {
        const query = await superagent.get(`${API_ENDPOINT}/users/@me/guilds`)
            .set("authorization", `${session.token_type} ${session.token}`);

        try {
            const json = query.body;

            const result = json?.filter(x => {
                const permissions = new PermissionsBitField(x.permissions)
                const checkAgainst = new PermissionsBitField(PermissionsBitField.Flags.ManageGuild)

                if (permissions.has(checkAgainst)) return x;
            })

            session.setGuilds(result)
        } catch (err) {
            console.log(query)
            console.log(err)
        }
    }
}