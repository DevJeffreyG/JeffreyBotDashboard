class ChannelSelector extends DiscordSelector {
    /**
     * @param {String} id Debe ser igual a lo que está en la base de datos
     * @param {String} name Lo que aparece al lado del input
     * 
     * @typedef {Object} ChannelOptions
     * @property {Number} min
     * @property {Number} max
     * @property {Boolean} interactable
     * @param {...ChannelOptions} options
     */
    constructor(id, name, options = { min: 0, max: Infinity, interactable: true }) {
        super(id)

        this.classname = "channel-drop";
        this.allElementsForList = Dashboard.getGuild().channels;
        this.wrapper.classList.add("channel-selector");

        this.discordItemInitializer(name, options);
    }
}