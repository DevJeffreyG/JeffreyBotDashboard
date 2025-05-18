class HTMLManager {
    /**
     * @param {String} str To search
     * @returns {Element}
     */
    static query(str) {
        return document.querySelector(str);
    }

    static queryAll(str) {
        return document.querySelectorAll(str);
    }

    /**
     * 
     * @param {Element} parent 
     * @param {String} str 
     * @param {InsertPosition} [pos="beforeend"] 
     */
    static parentAppend(parent, str, pos = "beforeend") {
        parent.insertAdjacentHTML(pos, str);
    }
}

/**
 * Crea el Manager para la dashboard
 */
class Dashboard {
    static SECTIONS = {
        HOME: "home",
        ACTIVE_MODULES: "active_modules",
        QUANTITIES: "quantities",
        FUNCTIONS: "functions",
        ROLES: "roles",
        LEVELS: "levels",
        CHANNELS: "channels",
        CATEGORIES: "categories",
        CHAT_REWARDS: "chat_rewards",
        HELP: "help",
        FAQ: "faq"
    }

    static #doc;
    static #guild;

    #Session; #imported;
    /**
     * @param {String} url 
     */
    constructor(url) {
        this.params = new URLSearchParams(window.location.search);
        this.searchParams = new Proxy(this.params, {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        this.req_url = url;
        this.#Session = null;
        this.fetchedAllGuilds = false;
        this.#imported = false;
    }

    /**
     * 
     * @param {String} query El path a navegar
     * @param {Object} root Desde donde se empieza, default: Dashboard.getDoc()
     * @returns {Object}
     */
    static documentPathHelper(query, root = null) {
        if (root === null && (!Dashboard.getDoc() || Dashboard.getDoc().guild_id != Dashboard.getGuild().id)) throw Error("root not specified, but doc doesn't exist")
        let r = root ?? Dashboard.getDoc();
        query.replaceAll("-", ".").split(".").forEach(path => r = r[path]);

        return r;
    }

    static replacePlaceholders(str, map) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
            return map.has(varName) ? map.get(varName) : match;;
        });
    }

    static getDoc() {
        return Dashboard.#doc;
    }

    static getGuild() {
        return Dashboard.#guild;
    }

    setSession(session) {
        this.#Session = session
        return this;
    }

    hasSession() {
        return this.#Session ? true : false;
    }

    importScripts() {
        if (this.#imported) return;
    }

    async manage() {
        if (!this.#Session?.discord_user) return window.location.replace("/login");

        this.importScripts();

        // revisar qué debería mostrarse ahora mismo
        this.urlSplit = this.req_url.replace(/\?.*$/, '').split("/").filter(x => x.length != 0);

        let suppGuildId = this.urlSplit.find(x => x.match(/\d+/))?.replace(/\D+/g, ""); // La id del supuesto servidor que se está administrando
        //console.log("URL SPLIT!!!!!!!!"+ suppGuildId);
        if (suppGuildId) await this.#manageGuild(suppGuildId);
        else await this.#selectServer();
    }

    /**
     * El manager principal que se muestra al estar "dentro" de un servidor
     * @param {Number} guildId 
     * @returns 
     */
    async #manageGuild(guildId) {
        console.log("managing guild", guildId);
        const body = HTMLManager.query("body");

        // Agregar bases, Sidebar
        HTMLManager.parentAppend(body, `
            <dashboard class="first">
                <div class="sidebar-wrap">
                    <div id="sidebar">
                        <a id="title" href="/dashboard">
                            <h1 class="title">
                                < Dashboard</h1>
                        </a>
                        <div class="line"></div>
                    </div>
                </div>
                <div class="container sidebar">
                    <a id="guildhome" href="#">
                        <h2 id="gname"></h2>
                    </a>
                </div>
            </dashboard>`)

        // Revisar si está fetcheado este servidor
        const guildObj = this.#Session.guilds?.find(x => x.id === guildId);
        const hasBeenRecentlyFetched = await ApiInteractor.check_guild_fetch(guildId, this.params)
        let cached;

        if (!hasBeenRecentlyFetched.fetched || !guildObj || !guildObj.channels) {
            cached = await ApiInteractor.get_guild(guildId, this.params);
        } else if (guildObj.channels) {
            cached = { guild: guildObj, channels: guildObj.channels }
        }

        // Si después de eso aún sigue sin conseguirse, es porque el bot no está en el server seleccionado
        if (!cached) {
            window.location.replace("/dashboard")
            window.open(`/invite/?guildId=${guildId}`, "_blank").focus();
            return;
        }

        Dashboard.#guild = cached.guild;
        Dashboard.#guild.allchannels = Dashboard.getGuild().channels;
        Dashboard.#guild.channels = Dashboard.getGuild().allchannels.filter(x => x.type === 0 || x.type === 2 || x.type === 5);
        Dashboard.#guild.categories = Dashboard.getGuild().allchannels.filter(x => x.type === 4);

        // Cargar el documento del server
        await this.#getDocument();

        // Cambiar el título
        const title = HTMLManager.query("#gname")
        title.innerHTML = Dashboard.getGuild().name;
        title.parentNode.href = `./${Dashboard.getGuild().id}`;
        document.title += ` — ${Dashboard.getGuild().name}`;

        Sidebar.identify(HTMLManager.query("#sidebar"))
        Sidebar.generateSidebar(Dashboard.getGuild().id);
        Sidebar.focus(this.urlSplit)
        HTMLManager.parentAppend(HTMLManager.query(".sidebar-wrap"), Sidebar.generateCopyright());

        // Administrar la sección en la que se está
        this.#handleGuild();
        // this.#handleAnimations();

        document.body.dataset.loaded = "";
    }

    async #getDocument() {
        if (Dashboard.getDoc() && Dashboard.getDoc().guild_id === Dashboard.getGuild().id) return;
        console.log("Getting document for %s", Dashboard.getGuild().id);

        try {
            let res = await ApiInteractor.get_db_guild(Dashboard.getGuild().id)
            if (!res) throw Error("couldn't fetch database's guild")
            Dashboard.#doc = res;
        } catch (err) {
            console.error("🔴 %s", err);
            alert(err.message)
            window.location.replace("/dashboard");
            window.open("/status", "_blank");
        }
    }

    #handleGuild() {
        const page = this.urlSplit[2] ?? Dashboard.SECTIONS.HOME; // [dashboard, 1234565, ######]
        switch (page) {
            case Dashboard.SECTIONS.ACTIVE_MODULES:
                ActiveModules.load();
                break;

            case Dashboard.SECTIONS.QUANTITIES:
                Quantities.load();
                break;

            case Dashboard.SECTIONS.FUNCTIONS:
                Functions.load();
                break;

            case Dashboard.SECTIONS.ROLES:
                Roles.load();
                break;

            case Dashboard.SECTIONS.CHANNELS:
                Channels.load();
                break;

            case Dashboard.SECTIONS.CATEGORIES:
                Categories.load();
                break;

            case Dashboard.SECTIONS.LEVELS:
                Levels.load();
                break;

            case Dashboard.SECTIONS.CHAT_REWARDS:
                ChatRewards.load();
                break;
        }
    }

    #handleAnimations() {
        let effects = HTMLManager.queryAll(".effect.inner")
        for (const effect of effects) {
            effect.addEventListener("mouseleave", () => {
                setTimeout(() => {
                    effect.parentNode.classList.add("removing-effect")
                }, 10000);
            }, { once: true })
        }
    }

    /**
     * La pantalla principal de la Dashboard, donde aparecen todos los servidores donde está el usuario y tiene permisos de administración
     */
    async #selectServer() {
        // Generar menu
        const body = HTMLManager.query("body");
        // Primeramente, los dummies
        HTMLManager.parentAppend(body, `
            <div class="container first">
                <h2>Administra un servidor</h2>
                <div class="boxes" id="guilds">
                    <div class="guild-child shine" id="dummy"></div>
                    <div class="guild-child shine" id="dummy"></div>
                    <div class="guild-child shine" id="dummy"></div>

                    <div class="guild-child shine" id="dummy"></div>
                    <div class="guild-child shine" id="dummy"></div>
                    <div class="guild-child shine" id="dummy"></div>
                </div>
            </div>`)

        // Cargar los servidores
        const guildBoxesContainer = HTMLManager.query("#guilds");

        // Buscar en los Partial_guilds de la Session
        //console.log(this.#Session.guilds, this.#Session.guilds.length === 0, !this.#Session.setMultipleGuilds, this.#Session.guilds.length === 0 || !this.#Session.setMultipleGuilds);
        if (this.#Session.guilds.length === 0 || !this.#Session.setMultipleGuilds) {
            document.body.dataset.loaded = "";
            console.log("No se fetchearon todos los guilds...");

            let fetchedGuilds = await ApiInteractor.get_all_guilds(this.params)
            this.#Session.guilds = fetchedGuilds;
            console.log("Fetcheados %s servers", this.#Session.guilds.length);

            ApiInteractor.update_session_guilds(fetchedGuilds, this.params).then(console.log).catch(err => {
                console.error("🔴 %s", err);
            });

        }

        // Agregar los servers reales
        this.#Session.guilds.forEach(guild => HTMLManager.parentAppend(guildBoxesContainer, `<div class="guild-child" id="${guild.id}"></div>`));

        // Eliminar los dummies
        HTMLManager.queryAll("#dummy").forEach(e => e.remove());

        const guildBoxes = HTMLManager.queryAll(".guild-child")
        for (const guildBox of guildBoxes) {
            const guild = this.#Session.guilds.find(x => x.id === guildBox.id);
            if (!guild) continue;

            const icon = `https://cdn.discordapp.com/icons/${guildBox.id}/${guild.icon}.png`
            HTMLManager.parentAppend(guildBox, `<img class="guild-icon" src="${guild.icon ? icon : "/static/svg/discord.svg"}" />
                <div class="guild-bg" style="background: ${guild.icon ? `url('${icon}') center center / cover no-repeat` : "transparent"};"></div>
                <div class="guild-info">
                    <p ${guild.name.length > 30 ? "style='font-size: 10px;'" : ""}>${guild.name}</p>
                </div>`)
        }

        // event clicks
        const clickeable_guilds = HTMLManager.queryAll(".guild-child");
        clickeable_guilds.forEach(g => g.addEventListener("click", (click) => handleGuilds(click.target)));

        document.body.dataset.loaded = "";

        function handleGuilds(element) {
            if (isNaN(element.id) || element.id.length === 0) handleGuilds(element.parentNode)
            else window.location.replace(`/dashboard/${element.id}`);
        }
    }
}