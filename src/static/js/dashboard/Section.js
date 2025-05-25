class Section {
    static title = null;

    /** @type {Selector[]} */
    static #subSectionSelectors = []

    /** @type {Selector[]} */
    static #allSelectors = []

    static #apiType = null;
    static #queryType = ApiInteractor.QUERY_TYPE.SAVE;

    static changes = new Map();
    static initial = new Map();
    static problems = new Map();

    static propertiesTransl = {
        "chat_rewards": "channel",
        "levels": "level"
    }

    static pushableChanges = "";

    static load() { throw Error(`load() method not defined on ${this.name}`) }

    static subtitle(text) {
        let d = document.createElement("h4")
        d.innerText = text
        return d;
    }

    static button(text, id) {
        let button = document.createElement("button")
        button.classList.add("button")
        button.id = id;
        button.style.width = "40%"

        button.append(text)

        return button
    }

    static submitButtonListener() {
        const submit = HTMLManager.query("#submit");
        submit?.addEventListener("click", async () => {
            console.log("attempting to submit...");
            let before = submit.innerText
            submit.classList.add("in-progress")
            submit.innerText = "..."
            await this.add();
            submit.classList.remove("in-progress")
            submit.innerText = before;
        })
    }

    static translateProperty(property) {
        return Section.propertiesTransl.hasOwnProperty(property) ? Section.propertiesTransl[property] : property
    }

    static prepareBase() {
        HTMLManager.parentAppend(HTMLManager.query(".container.sidebar"), `<div id="contents"></div>`)
        HTMLManager.parentAppend(HTMLManager.query("body"), `
        <div class="announcer">
        Hay cambios sin guardar
        <p class="show-link" style="margin-left: auto; margin-right: .4em; font-size: .7em;" id="cancelChanges">Cancelar</p>
        <div class="button fixed-size" id="saveChanges">Guardar</div>
        </div>
        <div class="button" id="jumpUp">
        <span class="material-symbols-rounded">keyboard_double_arrow_up</span>
        </div>`)

        Section.#buttonsManager();
    }

    /**
     * @param {ApiInteractor.API_TYPE} type 
     */
    static setApiType(type) {
        Section.#apiType = type;
    }

    /**
     * @param {ApiInteractor.QUERY_TYPE} type 
     */
    static setQueryType(type) {
        Section.#queryType = type;
    }

    static getApiType() {
        return Section.#apiType;
    }

    static getQueryType() {
        return Section.#queryType;
    }

    static setTitle(title) {
        if (!HTMLManager.query("#contents")) this.prepareBase();
        Section.title = title;
        const contents = HTMLManager.query("#contents");

        HTMLManager.parentAppend(contents, `<h1>${title}</h1>`);
    }

    /**
     * 
     * @param {String} root 
    */
    static setRoot(root) {
        this.root = root;
    }

    /**
     * @param {Selector[]} selectors 
    */
    static setSelectors(selectors) {
        Section.#subSectionSelectors = selectors;
        Section.#allSelectors.push(...selectors);
    }

    static getSelectors() {
        return Section.#subSectionSelectors;
    }

    static getAllSelectors() {
        return Section.#allSelectors;
    }

    static getInitial(id) {
        return Section.initial.get(id);
    }

    static setInitial(id, value) {
        return Section.initial.set(id, value);
    }

    static removeInitial(id) {
        return Section.initial.delete(id);
    }

    static getChange(id) {
        return Section.changes.get(id);
    }

    static setChange(id, value) {
        return Section.changes.set(id, value);
    }

    static removeChange(id) {
        return Section.changes.delete(id);
    }

    /**
     * @param {Boolean} condition Si es verdadero, se hace el cambio. Sino, se elimina de Section.changes
     * @param {String} id La llave a buscar en los cambios
     * @param {any} value El valor que toma en caso de ser verdadero
     */
    static toggleChangeIf(condition, id, value) {
        if (condition) Section.setChange(id, value);
        else Section.removeChange(id);
    }

    /**
     * @param {String} subtitle Lo que aparece en la página como un texto pequeño
     * @param {String|null} sectionId Debe ser igual a lo que está en la base de datos
     * @param {(Selector|Element)[]} selectors 
     * 
     * @typedef {Object} SubSectionOptions
     * @property {Boolean} ignoreSync Es una subsección que ignora los syncs por cada cambio hecho
     * @property {Boolean} join La subseccion une los Selectores (visualmente)
     * @param {...SubSectionOptions} options
    */
    static addSubSection(subtitle, sectionId = null, selectors, options = { ignoreSync: false, join: false }) {
        if (!HTMLManager.query("#contents")) this.prepareBase();

        this.setSelectors(selectors);

        const contents = HTMLManager.query("#contents");
        let _sectionId;

        // Asignarle al wrapper un ID
        if (sectionId && sectionId.length > 0) _sectionId = sectionId;
        else {
            let r = 0;
            while (HTMLManager.query("#wrapper-" + r)) {
                r++;
            }

            _sectionId = `wrapper-${r}`
        }

        HTMLManager.parentAppend(contents, `<div id="${_sectionId}" class="section wrap">${subtitle}</div>`)

        const subsection = HTMLManager.query(`div#${_sectionId}`);

        if (options?.join) subsection.classList.add("join")
        if (options?.ignoreSync) {
            subsection.dataset.ignoreSync = "";
            if (Section.getQueryType() === ApiInteractor.QUERY_TYPE.SAVE) console.log("save() query type on nonsyncable section");
        }

        // Agregar cada Selector definido
        let selectorhtml = ""
        for (const selector of this.getSelectors()) {
            if (selector instanceof Element) selectorhtml += selector.outerHTML.toString()
            else {
                if (sectionId && sectionId.length > 0) selector.updateId(sectionId);
                selector.syncRoot(this.root)

                selectorhtml += selector.toString();
            }
        }

        // Agregarlos al HTML
        HTMLManager.parentAppend(subsection, selectorhtml)

        Section.submitButtonListener();

        Section.#syncSubSectionSelectors();
        Section.#listenSubSectionSelectors();
    }

    /**
     * 
     * @param {String} subtitle 
     * @param {Number} id 
     * @param {String} type 
     * @param {DiscordSelector[]} baseSelectors 
     */
    static addDataVisualizer(subtitle, id, type, baseSelectors = [], checkForData = null) {
        if (!HTMLManager.query("#contents")) this.prepareBase();

        const contents = HTMLManager.query("#contents");
        let _id;

        // Asignarle al wrapper un ID
        if (id && id.length > 0) _id = id;
        else {
            let r = 0;
            while (HTMLManager.query("#visualizer-" + r)) {
                r++;
            }

            _id = `visualizer-${r}`
        }

        HTMLManager.parentAppend(contents, `<div id="${_id}" class="section wrap">${subtitle}<div class="item" data-type="sync-${type}"></div></div>`)
        const visualizer = HTMLManager.query(`[data-type="sync-${type}"]`);

        // Sincronizar la información a visualizar
        for (const data of Dashboard.documentPathHelper(`${this.root}.${type}`)) {
            // Buscar algo que coincida con los Selectors para este visualizador
            /** @type {DiscordSelector} */
            let dummySelector;
            let propertyMap = new Map();
            Object.keys(data).forEach(p => {
                if (!dummySelector) dummySelector = baseSelectors.find(x => x.id === p);
                if (p != "_id") propertyMap.set(p, data[p]);
            })

            // Al encontrar algo compatible
            if (dummySelector) {
                // Toma la información actual y la compatible para crear las listas sincronizadas
                const dummyData = propertyMap.get(dummySelector.id);
                const actualData = checkForData ? propertyMap.get(checkForData) : dummyData;
                const newName = Dashboard.replacePlaceholders(dummySelector.name, propertyMap);

                // console.log(propertyMap, actualData);

                /** @type {DiscordSelector} */
                let selector = new dummySelector.constructor(dummyData, newName, dummySelector.options) // Crea un nuevo Selector para agregarlo a la sección

                // Esto se ejecutará siempre antes de intentar sincronizar con .sync() el Selector
                selector.setNonInteractableSync(() => {
                    // Si aún está el div significa que no se eliminó como para tener que re-agregarlo al html
                    if (HTMLManager.query(`div.section div[id="${selector.id}"]`)) return;

                    HTMLManager.parentAppend(visualizer, `
                        <div id="${selector.id}" class="section">
                            ${selector.toString()}                    
                        </div>`)

                    let selectorElement = HTMLManager.query(`div#${_id} .` + Array.from(selector.wrapper.classList).join(".") + ":not([data-already-synced])");
                    selectorElement.dataset.alreadySynced = ""

                    propertyMap.forEach((val, key) => selectorElement.dataset[key] = val);

                    HTMLManager.parentAppend(selectorElement, `
                        <button class="button" id="removeItem" style="width: 40px;">
                                <span class="material-symbols-rounded">close</span>
                            </button>`)

                    // Listeners
                    const button = selectorElement.querySelector("#removeItem")
                    button.addEventListener("click", () => {
                        const item = button.parentElement;
                        let info = item.querySelector("div");

                        Section.setChange(info.id, this.translateProperty(type))
                        item.closest("div.section").remove();

                        Section.checkChanges();
                    })

                })

                // Sincronizar por primera vez el Selector no interactuable (y guardar para siempre su actualData)
                selector.sync(actualData)

                // Agregarlo a Section para que sea capaz de sincronizarlo de nuevo, por ejemplo: al darle al botón de cancelar
                Section.setSelectors([selector]);
            }
        }
    }

    static #buttonsManager() {
        const cancelButton = HTMLManager.query("#cancelChanges");
        cancelButton.addEventListener("click", async () => {
            try {
                this.#syncAllSelectors();
                Section.changes.clear();

                HTMLManager.query(".announcer").classList.remove("active")
            } catch (err) {
                console.error("🔴 %s", err);
            }
        })

        const saveButton = HTMLManager.query("#saveChanges");
        saveButton.addEventListener("click", async () => {
            console.log("attempting to save...");
            saveButton.classList.add("in-progress")
            let before = saveButton.innerText
            saveButton.innerText = "..."
            await this.save();
            saveButton.classList.remove("in-progress")
            saveButton.innerText = before;
        })

        const jumpUp = HTMLManager.query("#jumpUp");
        jumpUp.addEventListener("click", () => {
            HTMLManager.query(".container.sidebar").scroll({ top: 0, behavior: "smooth" });
        })
    }

    /**
     * Llama a todos los .sync() de los Selectors asociados a todas las subsecciones
    */
    static #syncAllSelectors() {
        for (const selector of Section.getAllSelectors()) {
            if (selector instanceof Selector) selector.sync();
        }
    }

    /**
     * Llama a todos los .sync() de los Selectors asociados a esta subsección
    */
    static #syncSubSectionSelectors() {
        for (const selector of Section.getSelectors()) {
            if (selector instanceof Selector) selector.sync();
        }
    }

    /**
     * Llama a todos los .listener() de los Selectors asociados a esta subsección
     */
    static #listenSubSectionSelectors() {
        for (const selector of this.#subSectionSelectors) {
            if (selector instanceof Selector) selector.listener();
        }
    }

    /**
     * @returns {Boolean} Es válido?
     */
    static #validateNonSyncable() {
        const parent = HTMLManager.query("[data-type]")
        if (!parent) return true;
        const dataType = parent.dataset.type.split("-")[1]; // chat_rewards, levels
        const queryType = this.getQueryType();

        const objChanges = Object.fromEntries(Section.changes);

        let rawData = Array.from(parent.children);

        let prop = Section.translateProperty(dataType);

        switch (queryType) {
            case ApiInteractor.QUERY_TYPE.ADD:
                // Verificar que no exista
                if (rawData.find(x => x.id === objChanges[prop])) {
                    this.problems.set(rawData.find(x => x.id === objChanges[prop]).children[0], {})
                    return false;
                }
                break
            case ApiInteractor.QUERY_TYPE.SAVE:
                let info = [];

                for (const section of rawData) {
                    const dataset = section.children[0].dataset;

                    let obj = {}

                    Object.keys(dataset).forEach(d => {
                        let dataVal = dataset[d];
                        if (dataVal.length > 0) {
                            obj[d] = dataVal.includes(",") ? dataVal.split(",") : dataVal;
                        }
                    });

                    info.push(obj)
                }

                Section.pushableChanges = JSON.stringify(info);
                return true;
        }



        return true;
    }

    static async #validateChanges() {
        let isValid = true;
        let reason = "";

        const objChanges = Object.fromEntries(Section.changes);
        Section.pushableChanges = JSON.stringify(objChanges);

        if (Section.changes.size === 0) isValid = false;

        // Validar los no sincronizables
        if (isValid) isValid = this.#validateNonSyncable();

        validation:
        for (const property in objChanges) {
            // Cada property corresponde al ID de los Selectors en cada subsección en los CAMBIOS
            if (!isValid) break validation; // Si dejó de ser válido no es necesario seguir
            let htmlElement = HTMLManager.query(`[id="${property}"]:not(a)`);
            let selectorObject = Section.getAllSelectors().find(x => x.htmlId === property);

            if (!htmlElement) continue; // fue eliminado


            const value = objChanges[property]; // El valor que sería guardado en la base de datos

            // Revisar que no estén vacíos los "ignoreSync"
            let parent = htmlElement.closest("div.section");
            let allReq = parent.querySelectorAll("div.item");

            let changed = Array.from(allReq).filter(x => typeof x.parentElement.dataset.ignoreSync != "undefined" && x.firstElementChild.id?.length > 0).flatMap(x => x.firstElementChild.id);
            for (const req of changed) {
                if (!Section.getChange(req)) {
                    isValid = false
                    reason = "No puede estar vacío"
                    this.problems.set(parent.querySelector(`#${req}`).parentElement, {})
                    break validation;
                }
            }

            // Selector Validation
            isValid = selectorObject.validate(value);
            reason = selectorObject.invalidReason;

            if (!isValid) {
                this.problems.set(htmlElement.parentElement, value);
                break validation;
            }

            // Actualizar los datasets para evitar que el announcer se active incorrectamente
            htmlElement.dataset.db = String(value);
            Section.initial.set(property, value);
        }

        // Mostrar los problemas al usuario
        if (!isValid) {
            const announcer = HTMLManager.query(".announcer");
            const initialTransform = getComputedStyle(announcer).transform

            const announcerKeyframes = [
                { transform: `${initialTransform} rotate(1deg)`, backgroundColor: "#f00", easing: "ease" },
                { transform: `${initialTransform} rotate(-1deg)` },
                { transform: `${initialTransform} rotate(0)` },
            ];

            for (const element of Array.from(Section.problems.keys())) {
                const initialColorEl = getComputedStyle(element).backgroundColor

                const elementKeyframes = [
                    { backgroundColor: "#f00", easing: "ease" },
                    { backgroundColor: initialColorEl, easing: "ease" }
                ];

                element.scrollIntoView({ behavior: "smooth" })
                element.animate(elementKeyframes, {
                    duration: 2000,
                    iterations: 1,
                })
            }

            announcer.animate(announcerKeyframes, {
                duration: 100,
                iterations: 3,
            })

            console.info(this.problems, reason);
            return false;
        }

        // Finalmente revisar si tiene permisos en el servidor para hacer cambios (Discord API)
        const hasPerms = await ApiInteractor.check_guild_permissions(Dashboard.getDoc().guild_id);

        // Si no tiene permisos, para empezar ni siquiera debería poder ver la Dashboard
        // Significa que perdió los permisos mientras estaba en ella, pedir relogeo
        if (!hasPerms || hasPerms.statusCode === 401) return window.location.replace("/login");

        return isValid;
    }

    static checkChanges() {
        console.log("%s changes detected...", Section.changes.size);
        const announcer = HTMLManager.query(".announcer");
        if (Section.changes.size > 0) announcer.classList.add("active");
        else announcer.classList.remove("active")
    }

    static async save() {
        if (this.getQueryType === ApiInteractor.QUERY_TYPE.ADD) this.setQueryType(ApiInteractor.QUERY_TYPE.SAVE);

        if (!Section.getApiType()) throw Error(`apitype not defined on ${this.name}`);
        const valid = await Section.#validateChanges();
        if (!valid) return;

        // Llamado a la base de datos con la nueva información
        let dbQuery = await ApiInteractor.update_db_guild(
            Dashboard.getDoc().guild_id,
            Section.getApiType(),
            Section.getQueryType(),
            Section.pushableChanges
        );

        if (dbQuery) {
            await ApiInteractor.send_log_to_guild(
                Section.title,
                Dashboard.getDoc().channels.logs.staff_logs,
                Section.pushableChanges
            );
            Section.initial.clear();
            Section.changes.clear();
            Section.checkChanges();
        }

        return dbQuery;
    }

    static async add() {
        this.setQueryType(ApiInteractor.QUERY_TYPE.ADD);

        // Hace exactamente lo mismo pero al final se debe recargar la página
        let q = await Section.save();
        if (q) window.location.reload();
        return q;
    }
}