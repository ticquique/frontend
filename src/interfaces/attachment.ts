import { IUser } from ".";

export interface IAttachment {
    id?: string;
    userId?: string | IUser;
    relatedId?: string;
    urls?: {
        small?: string,
        medium?: string,
        big?: string,
        low?: string,
        orig: string,
    };
    type?: 'book' | 'photo';
    createdAt?: Date;
    updatedAt?: Date;
}
