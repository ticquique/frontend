import { IUser } from ".";

export interface ISubscription {
    id?: string;
    subscriber?:  IUser;
    subscribable?: IUser;
}
