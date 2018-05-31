import { IAction } from "..";

export interface IFeed {
    id?: string;
    user?: string;
    actions?: IAction[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
