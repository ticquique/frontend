export interface IFind {
    resource?: string;
    filter?: string;
    sort?: string;
    page?: number;
    perPage?: number;
    partial?: boolean;
    populate?: string;
    view?: boolean;
    actionFilter?: string;
}

export type IEncriptedToken = string;
