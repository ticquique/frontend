export interface IAction {
    id?: string;
    user: string;
    object: string;
    IsHidden: boolean;
    type: 'Post' | 'Comment' | 'Reaction' | 'Subscription' | 'Message';
    relevancy: number;
    notified: boolean;
    viewed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
