export interface IComment {
    id?: string;
    discussionId: string;
    size?: number;
    comments?: [{
        text?: string;
        author?: {
            name: string,
            id: string,
        };
        comments?: string;
    }];
}
