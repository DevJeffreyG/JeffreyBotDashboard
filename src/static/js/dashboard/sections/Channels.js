class Channels extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.Channels)
        this.setRoot("channels")
        this.setTitle("Canales")
        this.addSubSection("Generales", "general", [
            new ChannelSelector("rules", "Reglas", { max: 1 }),
            new ChannelSelector("information", "Información", { max: 1 }),
            new ChannelSelector("faq", "FAQ", { max: 1 }),
            new ChannelSelector("announcements", "Anuncios", { max: 1 }),
            new ChannelSelector("halloffame", "Salón de la fama", { max: 1 }).setHelp("Aquí se enviarán los mensajes que reciban Awards.")
        ])
        this.addSubSection("Logs", "logs", [
            new ChannelSelector("staff_logs", "STAFF", { max: 1 }).setEffect(Selector.Effects.Recommended, "Aquí se envía información importante y útil. Deberías usarlo."),
            new ChannelSelector("moderation_logs", "Moderación", { max: 1 }),
            new ChannelSelector("guild_logs", "Server (Audit Logs)", { max: 1 }),
            new ChannelSelector("suggestions", "Sugerencias", { max: 1 }),
            new ChannelSelector("darkshop_logs", "DarkShop", { max: 1 }).setHelp("Aquí se envían interacciones en la DarkShop: Nueva inflación, acciones entre usuarios."),
            new ChannelSelector("user_left", "Usuario se fue del server", { max: 1 })
        ])
        this.addSubSection("Redes sociales", "notifier", [
            Section.subtitle("DEV ONLY (WIP)"),
            new ChannelSelector("youtube_notif", "YouTube", { max: 1 }),
            new ChannelSelector("twitch_notif", "Twitch", { max: 1 })
        ])
    }
}