class RoleSelector extends DiscordSelector {
    /**
     * @param {String} id Debe ser igual a lo que está en la base de datos
     * @param {String} name Lo que aparece al lado del input
     * 
     * @typedef {Object} RoleOptions
     * @property {Number} min
     * @property {Number} max
     * @property {Boolean} interactable
     * @param {...RoleOptions} options
     */
    constructor(id, name, options = { min: 0, max: Infinity, interactable: true }) {
        super(id)

        this.classname = "role-drop";
        this.allElementsForList = Dashboard.getGuild().roles;
        this.wrapper.classList.add("role-selector");

        this.discordItemInitializer(name, options);
    }
}