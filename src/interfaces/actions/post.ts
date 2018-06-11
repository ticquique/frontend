import { IUser, IAttachment } from "..";

export interface IPost {
  id?: string;
  title?: string;
  attachments?: string[] & IAttachment[];
  author?: string & IUser;
  comments?: string;
  reactions?: {
    like: number,
    dislike: number,
    love: number,
    fun: number
  };
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
