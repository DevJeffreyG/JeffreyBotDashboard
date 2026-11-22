export enum ChangeEnum {
    ADDED = 1,
    UPDATED = 2,
    REMOVED = 3
}

export type Change = {
    type: ChangeEnum;
    title: string;
    description?: string;
}
export type ChangelogType = {
    version: string;
    slogan?: string;
    changes: Change[];
    timestamp: Date;
};