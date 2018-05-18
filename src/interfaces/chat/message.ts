import { IUser } from "..";

export interface IMessage {
    id?: string;
    conversation?: string;
    body?: string[];
    author?: string | IUser;
    createdAt?: Date;
    updatedAt?: Date;
}
