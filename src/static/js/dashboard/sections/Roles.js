class Roles extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.Roles)
        this.setRoot("roles")
        this.setTitle("Roles")
        this.addSubSection("STAFF", null, [
            new RoleSelector("admins", "Roles de Admins"),
            new RoleSelector("staffs", "Roles de STAFF")
        ])
        this.addSubSection("Generales", null, [
            new RoleSelector("users", "Roles de usuario").setEffect(Selector.Effects.Featured, "¡Estos roles son dados una vez el usuario acepta las reglas del servidor!"),
            new RoleSelector("bots", "Roles de Bots").setEffect(Selector.Effects.Featured, "¡Se agregan estos roles automáticamente a los bots que se agreguen al servidor!"),
            new RoleSelector("birthday", "Rol de Cumpleaños", { max: 1 }),
            new RoleSelector("suggester_role", "Rol de recompensa de sugerencia", { max: 1 }),
        ])
        this.addSubSection("Anuncios", "announcements", [
            new RoleSelector("darkshop", "Eventos de DarkShop", { max: 1 }),
            Section.subtitle("Redes Sociales - DEV ONLY (WIP)"),
            new RoleSelector("youtube-videos", "YouTube", { max: 1 }),
            new RoleSelector("youtube-shorts", "YouTube Shorts", { max: 1 }),
            new RoleSelector("twitch", "Twitch", { max: 1 }),
        ])
    }
}