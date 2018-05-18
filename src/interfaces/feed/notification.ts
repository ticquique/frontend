import { IAction } from './action';

export interface INotification {
    id?: string;
    user?: string;
    actions?: IAction[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
