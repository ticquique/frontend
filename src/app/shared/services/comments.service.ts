import { Injectable } from "@angular/core";
import { IUser, IComment, IFind } from "../../../interfaces";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { environment } from "../../../environments/environment";
import { first } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class CommentsService {

  public user: IUser;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    userService.user.subscribe(user => this.user = user);
  }

  public createComment(object: string, text: string, name: string): Promise<any> {
    return new Promise<IComment>((resolve, reject) => {
      if (this.user) {
        this.httpClient.post<IComment>(environment.api.comment.newComment, {discussionId: object, text, name}).pipe(first()).subscribe(val => {
          if (val) { resolve(val); } else { reject(); }
        });
      }
    });
  }

  public getComment = (find?: IFind): Observable<IComment[]> => {
    let searchString = '';
    const searchArray: string[] = [];
    if (find) {
      if (find.resource) { searchArray.push(`resource=${find.resource}`); }
      if (find.filter) { searchArray.push(`filter=${find.filter}`); }
      if (find.page) { searchArray.push(`page=${find.page}`); }
      if (find.perPage) { searchArray.push(`perPage=${find.perPage}`); }
      if (find.partial) { searchArray.push(`partial=${find.partial}`); }
      if (find.sort) { searchArray.push(`sort=${find.sort}`); }
      if (find.populate) { searchArray.push(`populate=${find.populate}`); }
      if (find.view) { searchArray.push(`view=${find.view}`); }
      if (find.actionFilter) { searchArray.push(`actionFilter=${find.actionFilter}`); }
      searchString = `?${searchArray.join('&')}`;
    }
    return this.httpClient.get<IComment[]>(`${environment.api.comment.getComment}${searchString}`);
  }

}
