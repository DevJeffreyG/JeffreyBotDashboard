class ApiInteractor {
    static API_TYPE = {
        ActiveModules: 1,
        Quantities: 2,
        Functions: 3,
        Roles: 4,
        LevelRoles: 5,
        Channels: 6,
        RewardChannels: 7,
        Categories: 8
    }

    static QUERY_TYPE = {
        SAVE: "save",
        ADD: "add"
    }

    static #returnHelper(res) {
        return res.json().then(data => { return data });
    }

    static #returnTextHelper(res) {
        return res.text().then(data => { return data });
    }

    static async get_guild(guild_id, params = "") {
        return fetch("/api/get-guild?" + params, {
            headers: {
                "guildid": guild_id
            }
        }).then(res => this.#returnHelper(res));
    }

    static async get_db_guild(guild_id, params = "") {
        return fetch("/api/db/get-guild?" + params, {
            headers: {
                "guildid": guild_id
            }
        }).then(res => this.#returnHelper(res));
    }

    static async update_db_guild(guild_id, apitype, querytype, changes, params = "") {
        return fetch("/api/db/update-guild?" + params, {
            body: changes,
            headers: {
                "guildid": guild_id,
                "apitype": apitype,
                "querytype": querytype,
                'Content-Type': 'application/json'
            },
            method: "POST"
        }).then(res => this.#returnHelper(res));
    }

    static async get_all_guilds(params = "") {
        return fetch("/api/get-guilds?" + params).then(res => this.#returnHelper(res));
    }

    static async update_session_guilds(guilds, params = "") {
        return fetch("/api/session-update?" + params, {
            method: "POST",
            headers: {
                "tosync": "guilds",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guilds })
        }).then(res => this.#returnTextHelper(res))
    }

    static async check_guild_fetch(guild_id, params = "") {
        return fetch("/api/check_guild_fetch?" + params, {
            headers: {
                "guildid": guild_id
            }
        }).then(res => this.#returnHelper(res))
    }

    static async check_guild_permissions(guild_id, params = "") {
        return fetch("/api/guild/has-permissions?" + params, {
            headers: {
                "guildid": guild_id
            }
        }).then(res => this.#returnHelper(res))
    }

    static async send_log_to_guild(page, channelid, changes, params = "") {
        return fetch("/api/sendlog?" + params, {
            body: changes,
            headers: {
                "page": page,
                "channelid": channelid,
                'Content-Type': 'application/json'
            },
            method: "POST"
        }).then(res => this.#returnHelper(res))
    }
}