const Express = require("express")();
const superagent = require("superagent");
const { ValidateToken } = require("../../../utils/Functions");

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    app.post("/api/db/update", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        const q = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/update`)
            .send(req.body)
            .set({
                guildid: req.header("guildid"),
                apitype: Number(req.header("apitype")),
                querytype: req.header("querytype"),
                auth: req.cookies.token
            })
            .type('application/json');

        res.send(q.body);
    })

    app.post("/api/db/add-changelog", async (req, res) => {
        if (!ValidateToken(req, res)) res.sendStatus(401);
        const query = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/add-changelog`)
            .set("auth", req.cookies.token)
            .send(req.body);

        res.send(query.body);
    })
}