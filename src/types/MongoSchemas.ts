export type DashboardInfo = {
    name: string;
    help?: string;
    /** Tipo lógico del control (boolean, text, number, ...). Si falta se infiere del schema. */
    optionType?: string;
}

export type MongoValidator = {
    /** Identificador estable del validator (cuando el backend lo expone). */
    id?: string;
    /** Mensaje del validator. Se usa como fallback para schemas antiguos. */
    message?: string;
}

export type MongoInfo = {
    type: any;
    defaultValue: any;
    validators?: MongoValidator[];
}

export type MongoHelper = {
    dashboardInfo: DashboardInfo;
    mongoInfo: MongoInfo;
    path: string;
}