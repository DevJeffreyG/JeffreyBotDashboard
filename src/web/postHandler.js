const Express = require("express")();
const superagent = require("superagent");
const { ValidateToken, GenerateServerAuth, Decrypt} = require("../utils/Functions");
const { EmbedBuilder, codeBlock } = require("discord.js");
const jwt = require("jsonwebtoken");
const Session = require("../utils/Session");

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    app.post("/api/db/update-guild", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const q = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/update-guild`)
            .send(req.body)
            .set({
                guildid: req.header("guildid"),
                apitype: Number(req.header("apitype")),
                querytype: req.header("querytype"),
                auth: GenerateServerAuth()
            })
            .type('application/json')
            .catch(console.error);

        res.send(q.body);
    })

    app.post("/api/db/add-changelog", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const query = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/add-changelog`)
            .set("auth", GenerateServerAuth())
            .send(req.body)
            .catch(console.error);

        res.send(query.body);
    })

    app.post("/api/session-update", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const session = app.Sessions.getSession(req, res);

        switch (req.header("tosync")) {
            case "guilds":
                session.setGuilds(req.body.guilds)
                break

            default:
                return res.status(400).send({ message: "Invalid tosync header" });
        }

        res.sendStatus(200)
    })

    app.post("/api/refresh-discord", async (req, res) => {        
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        if(!req.cookies.refresh_token) return res.status(403).send("no refresh_token available");
        const refresh_token = Decrypt(req.cookies.refresh_token, process.env.APP_SECRET);

        console.log("old refresh:", refresh_token);

        if(!refresh_token) return res.sendStatus(403);

        // llamar al api de discord
        const auth_query = await superagent.post(`${Session.API_ENDPOINT}/oauth2/token`)
            .send({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token
            })
            .type("application/x-www-form-urlencoded")
            .catch(console.error);

        if(!auth_query || auth_query.badRequest) return res.sendStatus(403);

        console.log("CORRECT RESPONSE DISCORD");

        //console.log("DISCORD RESPONSE (REFRESH):", auth_query.body);

        return res.status(200).send(auth_query.body)
    })

    app.post("/api/sendlog", async (req, res) => {
        if (!ValidateToken(req, res)) return res.sendStatus(401);
        const session = app.Sessions.getSession(req, res);

        let changes = req.body;
        let channelId = req.header("channelid");
        let page = req.header("page");
        let executor = session.discord_user;

        let embed = new EmbedBuilder()
            .setTitle(`Cambios en la configuración`)
            .setDescription(`**—** **${executor.username}** hizo cambios en la configuración del bot.
**—** En la Dashboard.
**—** Lo que se guardó: ${codeBlock("json", JSON.stringify(changes))}
**—** En qué sección se hizo: \`${page}\`.`)
            .setColor("#00ff00")
            .setTimestamp();

        const sendQuery = await superagent.post(`${Session.API_ENDPOINT}/channels/${channelId}/messages`)
            .send(JSON.stringify({ embeds: [embed.data] }))
            .type("application/json")
            .set("authorization", `Bot ${process.env.TOKEN}`)
            .catch(console.error);

        let response = sendQuery.body;
        res.send(response)
    })
}