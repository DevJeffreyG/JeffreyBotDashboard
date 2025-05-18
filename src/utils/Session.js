const jwt = require("jsonwebtoken");
const superagent = require("superagent");
const { GenerateServerAuth, Encrypt, Decrypt } = require("./Functions");

class Session {
    static API_ENDPOINT = "https://discord.com/api/v10";
    static REDIRECT_URI = `${process.env.HOME_PAGE}/api/discord-callback`;

    #refresh_interval
    constructor(uuid) {
        this.uuid = uuid
        this.keepDiscordAlive = true
        this.#refresh_interval = null;
        this.discord_user = null
        this.guilds = []
        this.setMultipleGuilds = false;
        this.pendingCookieUpdate = true;
    }

    setToken(authinfo) {
        this.token_type = authinfo.token_type;
        this.token = authinfo.access_token;
        this.refresh = authinfo.refresh_token;
        this.expires = authinfo.expires_in;

        return this;
    }

    setDiscordUser(user) {
        this.discord_user = user
        return this
    }

    setGuilds(json) {
        this.guilds = json;
        this.setMultipleGuilds = true;
        return this
    }

    addGuildInfo(guild, channels) {
        let existing = this.guilds.findIndex(x => x.id === guild.id);

        if (existing != -1) {
            this.guilds[existing] = guild;
            this.guilds[existing].channels = channels;
        } else {
            guild['channels'] = channels
            this.guilds.push(guild);
        }

        return this
    }

    killDiscord() {
        this.keepDiscordAlive = false;
        clearInterval(this.#refresh_interval);
        return this;
    }

    /**
     * @param {Request} req
     * @param {Request} res
     * @returns {Promise<Boolean>} If it was able to refresh the token with the stored
     */
    async refreshToken(req = null, res = null, token = null) {
        //console.log(req.cookies);
        if (!this.keepDiscordAlive) return false;

        let refresh_token = this.refresh;
        if (!refresh_token && req.cookies.refresh_token) {
            try {
                //console.log(req.cookies.refresh_token);
                let refresh_decrypt = jwt.verify(Decrypt(req.cookies.refresh_token, process.env.APP_SECRET), process.env.TOKEN)

                if(refresh_decrypt.user_id != this.uuid) throw Error("incorrect session");

                refresh_token = refresh_decrypt?.refresh_token;
            } catch (err) {
                console.error("🔴 %s", err);
            }
        }
        if (!refresh_token) return false;

        //console.log("Refreshing Token:");
        //console.log(req.cookies);

        // Aqui se actualiza la Session y la Cookie
        const refreshQuery = await superagent.post(`${process.env.HOME_PAGE}/api/refresh-discord`)
            .set('Cookie', `token=${token ? encodeURIComponent(token) : req.cookies.token}; refresh_token=${Encrypt(refresh_token)}`)
            .catch(console.error);
        if (!refreshQuery) return false;

        console.log("Recovered it");

        this.setToken(refreshQuery.body);
        //console.log(this.refresh);

        this.pendingCookieUpdate = true;
        if (res) this.updateRefreshCookie(res);

        if (!this.#refresh_interval) this.startRefreshInterval();

        return true;
    }

    startRefreshInterval() {
        console.log("Starting interval", this.expires);
        this.#refresh_interval = setInterval(async () => {
            console.log("Interval call!");
            let refreshed = await this.refreshToken(null, null, GenerateServerAuth(5, 1));
            if (!refreshed) {
                console.log("Killing Discord Session");
                this.killDiscord();
            }

            this.pendingCookieUpdate = true;
        }, this.expires - 5000)

        return this;
    }

    updateRefreshCookie(res) {
        console.log("Updating Refresh Token Cookie!!!!! pending:", this.pendingCookieUpdate);
        if (!this.pendingCookieUpdate) return false;

        console.log("updating cookie with:", this.refresh);

        const refresh_token = jwt.sign({ refresh_token: this.refresh, user_id: this.uuid }, process.env.TOKEN, { expiresIn: this.expires })

        this.pendingCookieUpdate = false;
        res.cookie("refresh_token", Encrypt(refresh_token), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: this.expires,
            path: '/refresh'
        });

        res.cookie("user", jwt.sign({ rawUser: this.discord_user }, process.env.TOKEN, { expiresIn: this.expires }), {
            httpOnly: true,
            secure: true,
            maxAge: this.expires
        })

        return true;
    }
}

module.exports = Session
