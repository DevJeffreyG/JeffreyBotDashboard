class NumberSelector extends Selector {
    /**
     * @param {String} id Debe ser igual a lo que está en la base de datos
     * @param {String} name Lo que aparece al lado del input
     * 
     * @typedef {Object} NumberOptions
     * @property {String} placeholder
     * @property {Number} min
     * @property {Number} max
     * @param {...NumberOptions} options
     */
    constructor(id, name, options = { placeholder: null, min: 0, max: Infinity }) {
        super(id)
        this.name = name;
        this.options = options;
        this.options.placeholder = options.placeholder ?? ""
        this.options.min = options.min ?? 0;
        this.options.max = options.max ?? Infinity;

        this.wrapper.classList.add("number-selector");

        HTMLManager.parentAppend(this.wrapper, `<p>${name}</p>`)

        HTMLManager.parentAppend(this.wrapper, `
            <input type="number"
                placeholder="${this.options.placeholder}"
                min="${this.options.min}"
                max="${this.options.max}"
                id="${id}">
            </input>`)
    }


    sync() {
        const actualNumber = this.getCurrentData();

        this.element.value = String(actualNumber);
        this.element.dataset.db = String(actualNumber);
    }

    listener() {
        this.getElement();
        Section.setInitial(this.element.id, this.element.dataset.db ?? this.element.value);

        this.element.addEventListener("input", () => {
            let get = Section.getChange(this.element.id)

            Section.toggleChangeIf(
                typeof get === "undefined" || Section.getInitial(this.element.id) != this.element.value,
                this.element.id,
                this.element.value
            )

            if (!Selector.ignoresSync(this.element)) Section.checkChanges();
        })
    }

    validate(value) {
        this.invalidReason = `Debe ser mayor a ${this.options.min} y menor a ${Number(this.options.max) === Infinity ? "∞" : this.options.max}`
        // revisar que sea un número y que cumpla con las condiciones de mínimo y máximo
        return !(
            (typeof value !== "number" && isNaN(value)) ||
            Number(value) < Number(this.options.min) ||
            Number(value) > Number(this.options.max)
        )
    }
}