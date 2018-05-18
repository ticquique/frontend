import { IMessage } from './message';
import { IUser } from '..';
export interface IConversation {
    id?: string;
    participants?: IUser[];
    ip?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastMessage?: IMessage;
    listMessages?: IMessage[];
}
