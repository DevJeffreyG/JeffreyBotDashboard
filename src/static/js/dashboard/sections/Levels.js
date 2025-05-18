class Levels extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.LevelRoles);
        this.setTitle("Roles de niveles")
        this.setRoot("roles")
        this.addSubSection("", null, [
            new NumberSelector("level", "Nivel requerido", { min: 1, placeholder: "Nivel cuando se le darán los roles" }),
            new RoleSelector("roles", "Roles dados", { min: 1 }),
            Section.button("Agregar", "submit")
        ], { join: true, ignoreSync: true })
        this.addDataVisualizer("Actuales", null, "levels", [
            new RoleSelector("level", "Para el nivel {{level}}", { interactable: false })
        ], "roles")
    }
}