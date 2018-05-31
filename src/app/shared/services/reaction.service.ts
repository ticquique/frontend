import { Injectable } from "@angular/core";
import { IUser, IReaction, IFind } from "../../../interfaces";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { environment } from "../../../environments/environment";
import { first } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class ReactionService {

  public user: IUser;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    userService.user.subscribe(user => this.user = user);
  }

  public createReaction(related: string, type: 'like' | 'dislike' | 'love' | 'fun'): Promise<IReaction> {
    return new Promise<IReaction>((resolve, reject) => {
      if (this.user) {
        this.httpClient.post<IReaction>(environment.api.reaction.react, {related, type}).pipe(first()).subscribe(val => {
          if (val) { resolve(val); } else { reject(); }
        });
      }
    });
  }

  public getReaction = (find?: IFind): Observable<IReaction[]> => {
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
    return this.httpClient.get<IReaction[]>(`${environment.api.reaction.getReaction}${searchString}`);
  }

}
