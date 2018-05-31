import { IUser, IPost, IComment, IReaction, ISubscription, IMessage } from "..";

export interface IAction {
    id?: string;
    user: string & IUser;
    object: string & any;
    IsHidden: boolean;
    type: 'Post' | 'Comment' | 'Reaction' | 'Subscription' | 'Message';
    relevancy: number;
    notified: boolean;
    viewed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
