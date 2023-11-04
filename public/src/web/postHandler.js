const Express = require("express")();
const superagent = require("superagent");

/**
 * 
 * @param {Express} app 
 */
module.exports = (app) => {
    app.post("/api/db/update", async (req, res) => {
        const q = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/update`)
            .send(req.body)
            .set({
                guildid: req.header("guildid"),
                apitype: Number(req.header("apitype")),
                querytype: req.header("querytype"),
                auth: process.env.TOKEN
            })
            .type('application/json');

        res.send(q.body);
    })

    app.post("/api/db/add-changelog", async (req, res) => {
        const query = await superagent
            .post(`${process.env.JeffreyBotEnd}/api/db/add-changelog`)
            .set("auth", process.env.TOKEN)
            .send(req.body);

        res.send(query.body);
    })
}