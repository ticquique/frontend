import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { IFind, ISubscription, IUser } from '../../../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from './user.service';
import { first } from 'rxjs/operators';

@Injectable()
export class SubscriptionService {

  public subscribers: BehaviorSubject<ISubscription[]> = new BehaviorSubject<ISubscription[]>([]);
  public subscribeds: BehaviorSubject<ISubscription[]> = new BehaviorSubject<ISubscription[]>([]);
  public user: IUser;

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

  public getSubscriptions = (find?: IFind): Observable<ISubscription[]> => {
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
      searchString = `?${searchArray.join('&')}`;
    }
    return this.httpClient.get<ISubscription[]>(`${environment.api.chat.getChats}${searchString}`);
  }

  private addListeners(): void {
    this.getSubscriptions({resource: `subscribable-${this.user.id}`, populate: 'subscriber'}).pipe(first()).subscribe(val => { this.subscribers.next(val); });
    this.getSubscriptions({resource: `subscriber-${this.user.id}`, populate: 'subscribable'}).pipe(first()).subscribe(val => { this.subscribeds.next(val); });
  }

  private removeListeners(): void {
    this.subscribeds.next([]);
    this.subscribers.next([]);
  }

}
