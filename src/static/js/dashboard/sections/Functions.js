class Functions extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.Functions)
        this.setRoot("settings.functions")
        this.setTitle("Funciones")
        this.addSubSection("Generales", null, [
            new BoolSelector("save_roles_onleft", "Guardar roles al salir del server").setHelp("Cuando un usuario se sale del server, sus roles serán devueltos si se vuelve a unir.").setEffect(Selector.Effects.Recommended),
            new BoolSelector("levels_deleteOldRole", "Eliminar roles viejos por nivel"),
            Section.subtitle("Recordatorios de STAFF"),
            Section.subtitle("Medido en días. Cuando pasen suficientes días, si cierto elemento no recibe la atención del STAFF."),
            new NumberSelector("staff_reminders-suggestions", "Recordatorios: Sugerencias", { placeholder: "X días para que se recuerde una sugerencia sin respuesta", min: 1 }),
            new NumberSelector("staff_reminders-tickets", "Recordatorios: Tickets", { placeholder: "X días para que se recuerde un ticket sin respuesta", min: 1 }),
            new NumberSelector("staff_reminders-bets", "Recordatorios: Apuestas", { placeholder: "X días para que se recuerde una apuesta sin resultado", min: 1 }).setEffect(Selector.Effects.Recommended, "¡El dinero de los usuarios está en juego!")
        ])

        this.addSubSection("Ajuste automático", "adjust", [
            Section.subtitle("Jeffrey Bot tratará de ajustar los siguientes apartados"),
            Section.subtitle("Tiendas"),
            new BoolSelector("shop", "Precios de la tienda"),
            new BoolSelector("darkshop", "Precios de la DarkShop"),
            new BoolSelector("petshop", "Precios de la Tienda de Mascotas").setEffect(Selector.Effects.New),
            new BoolSelector("exshop", "Precios de la Tienda Externa").setEffect(Selector.Effects.New),
            Section.subtitle("Comandos"),
            new BoolSelector("coins", "Recompensas de /coins").setEffect(Selector.Effects.Featured),
            new BoolSelector("claim_rep", "Recompensas de /claimrep").setEffect(Selector.Effects.Featured),
            new BoolSelector("roulette", "Recompensas de /roulette").setEffect(Selector.Effects.Featured),
            Section.subtitle("Misc"),
            new BoolSelector("chat_rewards", "Dinero dado al hablar en los chats").setEffect(Selector.Effects.Featured),
        ])
    }
}