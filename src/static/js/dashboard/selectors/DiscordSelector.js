class DiscordSelector extends Selector {
    /**
     * @param {String} name Lo que aparece al lado del input
     * 
     * @typedef {Object} DiscordSelectorOptions
     * @property {Number} min
     * @property {Number} max
     * @property {Boolean} interactable
     * @param {...DiscordSelectorOptions} options
     */
    discordItemInitializer(name, options) {
        this.name = name;
        this.options = options;
        this.options.min = options.min ?? 0;
        this.options.max = options.max ?? Infinity;
        this.options.interactable = options.interactable ?? true;

        HTMLManager.parentAppend(this.wrapper, `<p>${name}</p>`)

        let interactableHTML = this.options.interactable ?
            `<span class="material-symbols-rounded" id="plus-icon">add_circle</span>
        <p class="search"></p>` : "";
        let isInterHTML = this.options.interactable ? `data-interactable=""` : "";
        let minHTML = this.options.min ? `data-min="${this.options.min}"` : "";
        let maxHTML = this.options.max ? `data-max="${this.options.max}"` : "";

        HTMLManager.parentAppend(this.wrapper, `
            <div class="${this.classname}" id="${this.id}" ${minHTML} ${maxHTML} ${isInterHTML}>
                ${interactableHTML}                
            </div>`)
    }

    sync(actual = null) {
        if (actual) this.actualData = actual;
        if (!this.options.interactable) this.nonInteractableSync();

        const actualData = this.actualData ?? this.getCurrentData();
        if (this.element === null || !this.options.interactable) this.getElement();

        /* console.log("Syncing", this.element);
        console.log(actualData); */

        // Si ahora mismo no hay nada seleccionado, crear una lista sin excluir a nadie
        if (!actualData) {
            let list = this.createList(this.allElementsForList, [])
            this.element.append(list)
        } else if (Array.isArray(actualData)) {
            this.element.querySelectorAll(".synchronizable").forEach(e => e.remove());
            actualData.forEach(id => this.element.appendChild(this.itemOfList(id)))

            const synced = this.element.childNodes;

            let list = this.createList(this.allElementsForList, synced);
            this.element.append(list)
        } else {
            if (actualData.length > 0) {
                this.element.querySelectorAll(".synchronizable").forEach(e => e.remove());
                this.element.appendChild(this.itemOfList(actualData));
            }

            let list = this.createList(this.allElementsForList, this.element.childNodes);
            this.element.append(list)
        }
    }

    listener() {
        this.getElement();
        if (!this.options.interactable) return;

        const id = this.element.id;
        Section.setInitial(id, this.translate(this.element.childNodes));

        let searchQuery = [];
        this.element.addEventListener("click", (click) => {
            function arrayEquals(a, b) {
                return Array.isArray(a) &&
                    Array.isArray(b) &&
                    a.length === b.length &&
                    a.every((val, index) => val === b[index]);
            }

            let clicked = click.target;

            // Es uno de los items seleccionables
            if (clicked.classList.contains("discordElement") || clicked.classList.length === 0) {
                searchQuery = [];
                this.element.querySelector(".search").innerHTML = "";
                clicked = clicked.querySelector("div") ?? clicked;

                if (clicked.closest(".item-list")) { // Un item de la lista a agregar
                    let gen = this.itemOfList(clicked.dataset.id);
                    this.element.appendChild(gen)

                    clicked.closest("li").remove();
                } else if (clicked.closest(`.${this.classname}`)) { // Un item que ya está agregado a la lista
                    clicked.remove()
                    this.element.closest("div.item").classList.remove("list-active");

                    let actualList = this.element.querySelector(".item-list");
                    let newList = this.createList(this.allElementsForList, this.element.childNodes)

                    this.element.replaceChild(newList, actualList)
                }

                Section.setChange(id, this.translate(this.element.childNodes))
                if (arrayEquals(Section.getInitial(id), Section.getChange(id))) Section.removeChange(id);

                if (!Selector.ignoresSync(this.element)) Section.checkChanges();

                // Si llega al máximo de opciones escogidas cerrar el dropdown (UX)
                if (Array.from(this.element.childNodes).filter(x => x.nodeName === "DIV").length >= this.options?.max) {
                    this.element.querySelector("ul").classList.remove("active");
                    this.element.closest("div.item").classList.remove("list-active");
                }
            } else {
                // buscar cualquier otro abierto y cerrarlo
                Array.from(document.querySelectorAll(".active")).filter(x => {
                    if (!(x.classList.contains("announcer") || x.classList.contains("switch") || x.nodeName === "A" || x.classList.contains("reveal")))
                        return x
                }).forEach(active => {
                    if (active.closest(`#${clicked.id}`) != clicked) {
                        active.classList.remove("active")
                        active.closest("div.item")?.classList.remove("list-active");
                    }
                })


                let list = this.element.querySelector("ul")
                list.classList.toggle("active");

                // agregar al wrapper también
                list.closest("div.item").classList.toggle("list-active");

                // Si está activa, habilitar búsqueda
                if (list.classList.contains("active")) {
                    searchQuery = [];
                    window.onkeyup = (evt) => {
                        let key = evt.key;
                        let first = null;

                        if (key[0] != key[0].toUpperCase() || key === " ") searchQuery.push(key)
                        else if (key === "Backspace") searchQuery.pop();

                        this.element.querySelector(".search").innerHTML = searchQuery.join("");

                        for (const li of list.childNodes) {
                            if (!li.firstChild) continue;
                            let elementName = li.firstChild.textContent.toLowerCase(); // el nombre del elemento: rolename, channelname
                            if (elementName.includes(searchQuery.join("")) && first === null) {
                                first = li;
                                break;
                            }
                        }

                        if (first) list.scroll({ top: first.offsetTop, behavior: "smooth" })
                    }
                } else {
                    window.onkeyup = null;
                }
            }
        })
    }

    validate() {
        const childs = Array.from(this.element.childNodes).filter(x => x.nodeName === "DIV");

        // Convertir el cambio en string para la db
        if (this.options.max === 1) {
            Section.setChange(this.element.id, childs.flatMap(x => x.dataset.id)[0] ?? String())
            Section.pushableChanges = JSON.stringify(Object.fromEntries(Section.changes));
        }

        this.invalidReason = `Debe ser mayor a ${this.options.min} y menor a ${Number(this.options.max) === Infinity ? "∞" : this.options.max}`

        return !(childs.length > Number(this.options.max) || childs.length < Number(this.options.min));
    }

    /**
     * 
     * @param {Array} allElements Array de los elementos en total
     * @param {NodeListOf<ChildNode>} dontInclude Lista de los nodos que ya existen
     * @param {Boolean} hidden Determina si la lista está oculta inicialmente
     * @param {Boolean} excludeEveryone Determina si se elimina el rol '@everyone'
     */
    createList(allElements, dontInclude, hidden = true, excludeEveryone = true) {
        let list = document.createElement("ul")
        list.classList.add("item-list");
        list.classList.add("synchronizable");
        if (!hidden) list.classList.add("active")

        let exists = allElements;
        excluding:
        for (const child of Array.from(dontInclude)) {
            if (!child.dataset?.id) continue excluding;
            exists = exists?.filter(x => x.id != child.dataset.id)
        }

        if (excludeEveryone)
            exists = exists?.filter(x => x.id != Dashboard.getGuild().id)

        // Discord Object
        for (const item of exists) {
            let gen = this.itemOfList(item.id);
            let element = document.createElement("li");

            // solo dejar el color de texto
            gen.style.cssText = `color: ${gen.style.color};`;

            element.append(gen);

            list.appendChild(element);
        }

        return list
    }

    /**
     * Crea un item para una lista de tipo Role o Channels
     * @param {String} id 
     * @returns {HTMLElement}
     */
    itemOfList(id) {
        let d = document.createElement("div");

        let f = x => x.id === id;
        let guildItem = Dashboard.getGuild().roles.find(f) || Dashboard.getGuild().channels.find(f) || Dashboard.getGuild().categories.find(f);

        if (!guildItem) guildItem = {
            name: "[ ELIMINADO ]"
        };

        d.classList.add("synchronizable")
        d.classList.add("discordElement");
        d.dataset.id = id;
        d.innerHTML = guildItem.name;

        if (guildItem.color) {
            let hexColor = guildItem.color.toString(16);

            if (hexColor.length < 6) hexColor = `${"0".repeat(6 - hexColor.length)}${hexColor}`;

            d.style.borderColor = `#${hexColor}`
            d.style.backgroundColor = `#${hexColor}3d` // opactity 20%
            d.style.color = `#${hexColor}`;
        }

        return d;
    }

    translate(nodes) {
        let translated = Array.from(nodes)
            .filter(x => !x.classList?.contains("item-list") && typeof x.dataset?.id != "undefined") // eliminar la lista de todos los roles/canales & todo lo que no sea la info de role/canal
            .flatMap(x => x.dataset.id) // sacar solo las ids

        if (this.options.max === 1 && translated.length === 1) translated = translated[0];

        return translated
    }

    /**
     * @param {Function} fn 
     */
    setNonInteractableSync(fn) {
        this.nonInteractableSync = fn;
        return this;
    }
}