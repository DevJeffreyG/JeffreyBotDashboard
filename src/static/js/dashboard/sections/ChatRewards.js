class ChatRewards extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.RewardChannels);
        this.setTitle("Recompensas en canales")
        this.setRoot("channels")
        this.addSubSection("", null, [
            new ChannelSelector("channel", "El canal configurado", { min: 1, max: 1 }),
            new NumberSelector("multiplier", "Multiplicador", { placeholder: "La base de lo que se gana se multiplica por esto", min: 0.01 }),
            Section.button("Agregar", "submit")
        ], { join: true, ignoreSync: true })
        this.addDataVisualizer("Actuales", null, "chat_rewards", [
            new ChannelSelector("channel", "Multiplicador x{{multiplier}} en", { interactable: false })
        ])
    }
}