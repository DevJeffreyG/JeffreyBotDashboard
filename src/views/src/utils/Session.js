class Session {
    constructor() {
    }

    setToken(authinfo) {


        this.token_type = authinfo.token_type;
        this.token = authinfo.access_token;
        this.refresh = authinfo.refresh_token;
        this.expires = authinfo.expires_in;

        return this;
    }

    setCookies(req) {
        this.cookies = req.cookies;
    }

    setDiscordUser(user) {
        this.discord_user = user
    }

    setGuilds(json) {
        this.guilds = json;
    }

    setDashboard(dashboard) {
        this.dashboard = dashboard;
    }

    addGuildInfo(guild, channels) {
        let existing = this.guilds.findIndex(x => x.id === guild.id);

        if (existing != -1) {
            this.guilds[existing] = guild;
            this.guilds[existing].channels = channels;
        } else {
            this.guilds.push({ guild, "guild.channels": channels });
        }
    }
}

module.exports = Session
