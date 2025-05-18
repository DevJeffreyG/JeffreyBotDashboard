class ActiveModules extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.ActiveModules)
        this.setRoot("settings.active_modules")
        this.setTitle("Módulos activos")
        this.addSubSection("Funciones", "functions", [
            new BoolSelector("suggestions", "Sugerencias"),
            new BoolSelector("tickets", "Tickets"),
            new BoolSelector("logs", "Logs"),
            new BoolSelector("birthdays", "Cumpleaños"),
            new BoolSelector("darkshop", "DarkShop").setEffect(Selector.Effects.Featured),
            new BoolSelector("rep_to_currency", "Rep -> $").setHelp("Habilita/deshabilita el comando /claimrep"),
            new BoolSelector("staff_reminders", "Recordatorios al STAFF").setEffect(Selector.Effects.Recommended, "Puede ser importante recibir recordatorios vitales.")
        ])
        this.addSubSection("Audit Logs", "logs-guild", [
            new BoolSelector("messageDelete", "Mensaje eliminado"),
            new BoolSelector("messageUpdate", "Mensaje editado")
        ])
        this.addSubSection("Logs de moderación", "logs-moderation", [
            new BoolSelector("warns", "Warns"),
            new BoolSelector("softwarns", "Softwarns"),
            new BoolSelector("pardons", "Pardons"),
            new BoolSelector("bans", "Baneos"),
            new BoolSelector("timeouts", "Expulsiones del chat"),
            new BoolSelector("clears", "Clear"),
            new BoolSelector("automod", "Auto moderación")
        ])
        this.addSubSection("Logs de STAFF", "logs-staff", [
            new BoolSelector("tickets", "Tickets"),
            new BoolSelector("settings", "Configuraciones").setEffect(Selector.Effects.Recommended, "Registra y notifica los cambios realizados en la configuración de Jeffrey Bot."),
            new BoolSelector("errors", "Errores").setEffect(Selector.Effects.Recommended, "Si hay algun error en la configuración, no podrías saberlo si esto no está activo.")
        ])
        this.addSubSection("Auto moderación", "automoderation", [
            new BoolSelector("remove_links", "Eliminar links").setHelp("Elimina mensajes de usuarios que contienen links y no tienen el permiso de 'Insertar Links/Embed Links'.")
        ])
    }
}