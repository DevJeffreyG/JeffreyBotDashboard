class BoolSelector extends Selector {
    /**
     * @param {String} id Debe ser igual a lo que está en la base de datos
     * @param {String} name Lo que aparece al lado del Switch
     */
    constructor(id, name) {
        super(id)
        this.name = name;
        this.wrapper.classList.add("bool-selector");

        HTMLManager.parentAppend(this.wrapper, `<p>${name}</p>`)
        HTMLManager.parentAppend(this.wrapper, `<div id="${id}" class="switch"></div>`)
    }

    sync() {
        const isActive = this.getCurrentData();

        /* console.log("Syncing", this.element.id);
        console.log(isActive); */

        if (isActive) this.element.classList.add("active");
        else this.element.classList.remove("active");
    }

    listener() {
        this.getElement();

        this.element.addEventListener("click", () => {
            this.element.classList.toggle("active");

            let get = Section.getChange(this.element.id);

            Section.toggleChangeIf(typeof get === "undefined", this.element.id, this.element.classList.contains("active"));

            if (!Selector.ignoresSync(this.element)) Section.checkChanges();
        })
    }

    validate(value) {
        this.invalidReason = "No es V/F";
        return typeof value === "boolean"
    }
}