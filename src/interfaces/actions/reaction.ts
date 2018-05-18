export interface IReaction {
    id?: string;
    type: 'like' | 'dislike' | 'love' | 'fun';
    user?: string;
    related?: string | any;
    reference?: 'Post';
    createdAt?: Date;
    updatedAt?: Date;
}
