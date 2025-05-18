class Selector {
    static Effects = {
        None: "none-effect",
        New: "new-effect",
        Featured: "featured-effect",
        Recommended: "recommended-effect",

    }

    constructor(id) {
        this.id = id;
        this.htmlId = id;
        this.root = Dashboard.getDoc();
        this.element = null;
        this.invalidReason = ""
        this.actualData = null
        this.effect = Selector.Effects.None
        this.nonInteractableSync = () => { }

        this.createWrapper()
    }

    /**
     * Revisa si el Selector ignora la sincronización
     * @param {HTMLElement} element
     * @returns {Boolean}
     */
    static ignoresSync(element) {
        if (element.closest("[data-ignore-sync]")) return true
        return false
    }

    setHelp(helpText) {
        let toolTipIcon = document.createElement("span");

        toolTipIcon.className = "selector-help material-symbols-rounded thick";
        toolTipIcon.innerText = "help";

        let tooltip = document.createElement("span");
        tooltip.className = "tooltip";
        tooltip.innerText = helpText;

        toolTipIcon.appendChild(tooltip);

        this.wrapper.insertBefore(toolTipIcon, this.wrapper.childNodes[1]);

        return this
    }

    /**
     * Cambia el efecto del Selector
     * @param {Selector.Effects} effect 
     * @param {String} customTooltip
     * @returns {this}
     */
    setEffect(effect, customTooltip = null) {
        this.effect = effect

        let inner = document.createElement("div")
        inner.dataset.effect = effect
        inner.classList.add("effect")
        inner.classList.add("inner")

        this.wrapper.appendChild(inner)

        this.wrapper.classList.add(effect)

        let icon;
        switch (effect) {
            case Selector.Effects.Recommended:
                icon = `<span class="material-symbols-rounded thick effect-symbol" style="color: var(--recommendedColor);">mode_heat<span class="tooltip">${customTooltip ?? "¡Recomendado, deberías usar esto!"}</span></span>`
                break

            case Selector.Effects.Featured:
                icon = `<span class="material-symbols-rounded thick effect-symbol" style="color: var(--featuredColor);">star<span class="tooltip">${customTooltip ?? "¡Destacado, suele usarse mucho!"}</span></span>`
                break

            case Selector.Effects.New:
                icon = `<span class="material-symbols-rounded thick effect-symbol" style="color: var(--newColor);">fiber_new<span class="tooltip">${customTooltip ?? "¡Nuevo!"}</span></span>`
                break
        }

        HTMLManager.parentAppend(this.wrapper, icon)

        return this
    }

    createWrapper() {
        let e = document.createElement("div")
        e.classList.add("item");
        this.wrapper = e;
    }

    updateId(parentId) {
        this.htmlId = `${parentId}-${this.id}`;

        this.wrapper.querySelector(`#${this.id}`).id = this.htmlId;
    }

    toString() {
        return this.wrapper.outerHTML;
    }

    /**
     * @param {String} newRoot 
     */
    syncRoot(newRoot) {
        this.root = Dashboard.documentPathHelper(newRoot, this.root)
        return this;
    }

    getElement() {
        this.element = document.querySelector(`div.item [id="${this.htmlId}"]:not(.section)`);
        return this;
    }

    /**
     * Consigue el valor actual de este Selector en la base de datos
     * @returns {Number|Boolean|any}
     */
    getCurrentData() {
        this.getElement();

        let path = this.htmlId.replace(/-/g, ".");
        let active = this.root;

        path.split(".").forEach(p => active = active ? active[p] : undefined);

        return active
    }

    sync() { throw Error(`sync() method not defined on ${this.constructor.name}`) }
    listener() { throw Error(`listener() method not defined on ${this.constructor.name}`) }
    validate(value) { throw Error(`validate() method not defined on ${this.constructor.name}`) }
}