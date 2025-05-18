class CategorySelector extends DiscordSelector {
    /**
     * @param {String} id Debe ser igual a lo que está en la base de datos
     * @param {String} name Lo que aparece al lado del input
     * 
     * @typedef {Object} CategoryOptions
     * @property {Number} min
     * @property {Number} max
     * @property {Boolean} interactable
     * @param {...CategoryOptions} options
     */
    constructor(id, name, options = { min: 0, max: Infinity, interactable: true }) {
        super(id)

        this.classname = "category-drop";
        this.allElementsForList = Dashboard.getGuild().categories;
        this.wrapper.classList.add("channel-selector");

        this.discordItemInitializer(name, options);
    }
}