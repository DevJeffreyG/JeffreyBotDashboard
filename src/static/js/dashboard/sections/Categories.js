class Categories extends Section {
    static load() {
        this.setApiType(ApiInteractor.API_TYPE.Categories)
        this.setRoot("categories")
        this.setTitle("Categorías")
        this.addSubSection("", null, [
            new CategorySelector("tickets", "Tickets", { max: 1 })
        ])
    }
}