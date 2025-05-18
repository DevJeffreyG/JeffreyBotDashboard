class Sidebar {
    static #guildId
    static sidebarNode;
    static sidebar = [];
    static options = [];
    static addOption(option, text) {
        this.options.push(option);
        this.sidebar.push(`<a id="${option}" href="/dashboard/${this.#guildId}/${option != Dashboard.SECTIONS.HOME ? option : ""}">${text}</a>`)
    }

    /**
     * @param {Element} el 
     */
    static identify(el) {
        this.sidebarNode = el
    }
    static addLine() {
        this.sidebar.push(`<div class="line"></div>`)
    }

    static generateCopyright() {
        return `<div id="copyright"><label id="copyright"></label></div>`
    }

    static generateSidebar(guildId) {
        this.#guildId = guildId;
        this.addOption(Dashboard.SECTIONS.HOME, "Inicio")
        this.addLine()
        this.addOption(Dashboard.SECTIONS.ACTIVE_MODULES, "Módulos activos")
        this.addOption(Dashboard.SECTIONS.QUANTITIES, "Cantidades")
        this.addOption(Dashboard.SECTIONS.FUNCTIONS, "Funciones")

        this.addLine();

        this.addOption(Dashboard.SECTIONS.ROLES, "Roles")
        this.addOption(Dashboard.SECTIONS.LEVELS, "Roles de niveles")

        this.addLine();

        this.addOption(Dashboard.SECTIONS.CHANNELS, "Canales")
        this.addOption(Dashboard.SECTIONS.CATEGORIES, "Categorías")
        this.addOption(Dashboard.SECTIONS.CHAT_REWARDS, "Recompensas en canales")

        this.addLine();
        this.addOption(Dashboard.SECTIONS.HELP, "Ayuda")
        this.addOption(Dashboard.SECTIONS.FAQ, "FAQ")

        this.addLine();
        HTMLManager.parentAppend(this.sidebarNode, this.sidebar.join(""));
    }

    /**
     * @param {Array} splittedUrl 
     */
    static focus(splittedUrl) {
        const inside = splittedUrl.slice().reverse().find(pathInUrl => {
            return this.options.find(x => x === pathInUrl)
        })

        let sidebarSubmenus = Array.from(this.sidebarNode.querySelectorAll("a"));
        const selected = sidebarSubmenus.find(x => x.id === inside) ?? sidebarSubmenus.find(x => x.id === "home");

        selected.classList.add("active"); // Resaltar como activa
        selected.classList.add("disabled");

        // Scrollear hasta esa seccion
        console.info(this.sidebarNode.clientHeight / selected.offsetTop, selected.offsetTop)
        if (this.sidebarNode.clientHeight / selected?.offsetTop < 1.5) {
            // por alguna razón hay que poner esto o sino NO SCROLLEA QUÉ PASA
            setTimeout(() => {
                this.sidebarNode.parentElement.scroll({ top: selected.offsetTop, behavior: "smooth" })
            }, 5);
        }
    }
}