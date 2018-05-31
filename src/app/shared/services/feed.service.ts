import { Injectable } from "@angular/core";
import { IUser, IFind, ISubscription, IFeed, IPost } from "../../../interfaces";
import { HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";
import { first } from "rxjs/operators";

@Injectable()
export class FeedService {

  public user: IUser;
  public feed: BehaviorSubject<IFeed> = new BehaviorSubject<IFeed>(null);

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {
    userService.user.subscribe(user => {
      if (user) {
        this.addListeners();
      } else {
        this.removeListeners();
      }
    })
  }

  public createPost(data: FormData): Promise<IPost> {
    return new Promise<IPost>((resolve, reject) => {
      this.httpClient.post<IPost>(environment.api.post.createPost, data).pipe(first()).subscribe(val => {
        if (val) { resolve(val); } else { reject(); }
      })
    });
  }

  public getPost = (find?: IFind): Observable<IPost[]> => {
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
    return this.httpClient.get<IPost[]>(`${environment.api.post.getPost}${searchString}`);
  }

  private updateFeed(find?: IFind): void {
    let searchString = '';
    const searchArray: string[] = [];
    if (find) {
      if (find.page) { searchArray.push(`page=${find.page}`); }
      searchString = `?${searchArray.join('&')}`;
    }
    this.httpClient.get<IFeed>(`${environment.api.feed.getPrevious}${searchString}`).pipe(first()).subscribe((val) => { if (val) { this.feed.next(val); } });
  }

  private addListeners(): void {
    this.httpClient.get<IFeed>(`${environment.api.feed.getPosts}`).pipe(first()).subscribe((val) => { if (val) {
      this.feed.next(val);
    }});
  }

  private removeListeners(): void {
    this.feed.next(null);
  }

}
