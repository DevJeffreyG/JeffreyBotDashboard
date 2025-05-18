class Quantities extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.Quantities)
        this.setRoot("settings.quantities")
        this.setTitle("Cantidades")
        this.addSubSection("Valores base: Generales", null, [
            new NumberSelector("blackjack-consecutive_wins", "Blackjack: Victorias consecutivas", { placeholder: "5", min: 1 }).setHelp("Al llegar a esta cantidad de victorias, se aplicará un cooldown."),
            new NumberSelector("darkshop-level", "DarkShop: Nivel mínimo", { placeholder: "5", min: 0 }),
            new NumberSelector("darkshop-baseprice", "DarkShop: Valor base", { placeholder: "200", min: 1 }),
            new NumberSelector("currency_per_rep", "Dinero/Rep", { placeholder: "500", min: 1 }).setHelp("Dinero dado por cada punto de reputación. (/claimrep)")
        ])
        this.addSubSection("Valores base: Intereses", null, [
            Section.subtitle("Cada X días"),
            new NumberSelector("interest_days-secured", "Dinero asegurado", { placeholder: "14", min: 0 }).setHelp("Cobrar cada X días intereses a los usuarios que aseguren su dinero.").setEffect(Selector.Effects.New, "Los usuarios ahora pueden asegurar su dinero de robos."),
        ])
        this.addSubSection("Valores base: Awards", "awards", [
            Section.subtitle("Tier 1"),
            new NumberSelector("tier1-price", "Precio del premio", { placeholder: "100", min: 1 }),
            new NumberSelector("tier1-gift", "Regalo del premio", { placeholder: "0", min: 0 }),
            Section.subtitle("Tier 2"),
            new NumberSelector("tier2-price", "Precio del premio", { placeholder: "500", min: 1 }),
            new NumberSelector("tier2-gift", "Regalo del premio", { placeholder: "100", min: 0 }),
            Section.subtitle("Tier 3"),
            new NumberSelector("tier3-price", "Precio del premio", { placeholder: "1800", min: 1 }),
            new NumberSelector("tier3-gift", "Regalo del premio", { placeholder: "700", min: 0 }),
        ])

        this.addSubSection("Mínimos y Máximos", "limits", [
            Section.subtitle("Blackjack"),
            new NumberSelector("bets-blackjack-min", "Blackjack: Apuesta mínima", { placeholder: "1000", min: 1 }),
            new NumberSelector("bets-blackjack-max", "Blackjack: Apuesta máxima"),
            Section.subtitle("Apuestas"),
            new NumberSelector("bets-staff_bets-min", "Apuestas: Puje mínimo", { placeholder: "10", min: 1 }).setEffect(Selector.Effects.New),
            new NumberSelector("bets-staff_bets-max", "Apuestas: Puje máximo", { placeholder: "1000" }).setHelp("El puje total máximo. No pueden apostar más de esto por apuesta.").setEffect(Selector.Effects.New),
            Section.subtitle("Recompensas del chat"),
            new NumberSelector("chat_rewards-exp-min", "Recompensas del chat: EXP mínima", { placeholder: "5", min: 1 }),
            new NumberSelector("chat_rewards-exp-max", "Recompensas del chat: EXP máxima", { placeholder: "35" }),
            new NumberSelector("chat_rewards-currency-min", "Recompensas del chat: Dinero mínimo", { placeholder: "5", min: 1 }),
            new NumberSelector("chat_rewards-currency-max", "Recompensas del chat: Dinero máximo", { placeholder: "15" }),
            Section.subtitle("Mascotas"),
            new NumberSelector("pets-hunger-min", "Mascotas: hambre mínima dada", { placeholder: "1", min: 1 }),
            new NumberSelector("pets-hunger-max", "Mascotas: hambre máxima dada", { placeholder: "3", min: 1 }),
            Section.subtitle("Coins"),
            new NumberSelector("currency-coins-min", "Dinero mínimo dado", { placeholder: "1", min: 1 }),
            new NumberSelector("currency-coins-max", "Dinero máximo dado", { placeholder: "20", min: 1 }),
        ])

        this.addSubSection("%Porcentajes", "percentages", [
            Section.subtitle("Mínimos y Máximos: Robar"),
            new NumberSelector("limits-rob-success-min", "Robar: %Mínima recompensa", { placeholder: "Debe ser menor que el máximo", min: 1, max: 100 }),
            new NumberSelector("limits-rob-success-max", "Robar: %Máxima recompensa", { placeholder: "Debe ser mayor que el mínimo", min: 1, max: 100 }),
            new NumberSelector("limits-rob-fail-min", "Robar: %Mínimo castigo", { placeholder: "Debe ser menor que el máximo", min: 1, max: 100 }),
            new NumberSelector("limits-rob-fail-max", "Robar: %Máximo castigo", { placeholder: "Debe ser mayor que el mínimo", min: 1, max: 100 }),
            Section.subtitle("DarkShop"),
            new NumberSelector("skipfirewall", "DarkShop: %Saltar Firewall", { placeholder: "100", min: 0, max: 100 }).setHelp("Probabilidad de que funcione el item especial 'Firewall'."),
            Section.subtitle("Mascotas"),
            new NumberSelector("pets-basic_unlocked", "Mascotas: %Desbloquear básico", { placeholder: "5", min: 0, max: 100 }).setHelp("Probabilidad de que al atacar, la mascota haga más daño de lo normal.").setEffect(Selector.Effects.New),
            Section.subtitle("Intereses"),
            new NumberSelector("interests-transaction_secured", "Dinero asegurado: %Interés Transacciones", { placeholder: "10", min: 0, max: 100 }).setHelp("Cuando se protejan (/save) y cuando se saquen (/with), ¿cuánto % se cobra por la cantidad?").setEffect(Selector.Effects.New),
            new NumberSelector("interests-secured", "Dinero asegurado: %Interés", { placeholder: "5", min: 0, max: 100 }).setHelp("Cuando se cobren los intereses, ¿cuánto % se cobra por la cantidad asegurada?").setEffect(Selector.Effects.New)
        ])

        this.addSubSection("Ignorar notificaciones", "ignore_notifications", [
            Section.subtitle("DEV ONLY (WIP)"),
            new NumberSelector("youtube_videos", "Días pasados para ignorar (Vídeos)", { placeholder: "14", min: 1 }),
            new NumberSelector("youtube_shorts", "Días pasados para ignorar (Shorts)", { placeholder: "14", min: 1 })
        ])
    }
}