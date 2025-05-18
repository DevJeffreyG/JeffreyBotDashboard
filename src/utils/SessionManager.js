const Session = require("./Session")
const uuid = require("uuid");
const ms = require("ms");
const { Encrypt, Decrypt } = require("./Functions");

class SessionManager {
    constructor() {
        /** @type {Session[]} */
        this.sessions = []
    }

    /**
     * @param {Request} req 
     * @param {Response} res
     * @returns {Session}
     */
    getSession(req, res) {
        /* console.log("getting session");
        console.log(req.cookies);
        console.log(this.sessions.length); */

        const searchUUID = Decrypt(req.cookies.uuid, process.env.APP_SECRET);
        let finding = this.sessions.find(x => x.uuid === searchUUID);
        if (!finding) {
            if (!req.cookies.uuid) {
                let gen = Encrypt(uuid.v6());
                res.cookie("uuid", gen, { maxAge: ms("400d") });
                this.sessions.push(new Session(gen));

                return this.sessions.at(-1)
            }

            this.sessions.push(new Session(searchUUID))
            return this.sessions.at(-1)
        }

        return finding;
    }

    closeSession(uuid) {
        let i = this.sessions.findIndex(x => x.uuid === uuid);
        this.sessions.splice(i, 1);

        console.log(this.sessions.length);
        return this
    }
}

module.exports = SessionManager