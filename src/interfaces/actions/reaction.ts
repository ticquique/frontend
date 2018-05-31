import { IUser } from "..";

export interface IReaction {
    id?: string;
    type: 'like' | 'dislike' | 'love' | 'fun';
    user?: string & IUser & any;
    related?: string | any;
    reference?: 'Post';
    createdAt?: Date;
    updatedAt?: Date;
}
