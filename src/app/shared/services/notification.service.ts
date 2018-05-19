import { SocketService } from './socket.service';
import { ISubscription } from './../../../interfaces/subscription';
import { IComment } from './../../../interfaces/actions/comment';
import { IAction } from './../../../interfaces/feed/action';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IFind, INotification, IReaction } from '../../../interfaces';
import { environment } from '../../../environments/environment';
import { first } from 'rxjs/operators';

@Injectable()
export class NotificationService {

  public notifications: BehaviorSubject<INotification> = new BehaviorSubject<INotification>(null);
  public messages: BehaviorSubject<IAction[]> = new BehaviorSubject<IAction[]>([]);
  public comments: BehaviorSubject<IAction[]> = new BehaviorSubject<IAction[]>([]);
  public reactions: BehaviorSubject<IAction[]> = new BehaviorSubject<IAction[]>([]);
  public subscriptions: BehaviorSubject<IAction[]> = new BehaviorSubject<IAction[]>([]);
  public posts: BehaviorSubject<IAction[]> = new BehaviorSubject<IAction[]>([]);
  private socket: SocketIOClient.Socket;

  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {
    this.socketService.socket.subscribe(socket => {
      this.socket = socket;
      if (socket) {
        this.addListeners();
      } else {
        this.notifications.next(null);
        this.messages.next([]);
        this.comments.next([]);
        this.reactions.next([]);
        this.subscriptions.next([]);
        this.posts.next([]);
      }
    });
  }

  public viewNotifications = (type: 'messages' | 'comments' | 'posts' | 'reactions' | 'subscriptions') => {
    let actions = this[type].getValue();
    actions = actions.map(val => {
      if (!val.viewed) { val.viewed = true; }
      return val;
    });
    this[type].next(actions);
  }

  public viewNotification = (action: string, type: 'messages' | 'comments' | 'posts' | 'reactions' | 'subscriptions') => {
    let actions = this[type].getValue();
    actions = actions.map(val => {
      if (action === val.object && !val.viewed) { val.viewed = true; }
      return val;
    });
    this[type].next(actions);
  }

  public addListeners = () => {
    this.socket.on('connect', () => this.onConnect());
    this.socket.on('notif', data => this.onNotification(data));
    this.socket.on('disconnect', () => this.resetNotifications());
  }

  public addNotification = (action: IAction, addNotification: boolean = true) => {
    const newNotification = this.notifications.getValue();
    action.viewed = false;
    newNotification.actions.unshift(action);
    this.notifications.next(newNotification);
    if (action.type === 'Message') {
      const newAction = this.messages.getValue();
      newAction.unshift(action);
      this.messages.next(newAction);
    } else if (action.type === 'Comment') {
      const newAction = this.comments.getValue();
      newAction.unshift(action);
      this.comments.next(newAction);
    } else if (action.type === 'Reaction') {
      const newAction = this.reactions.getValue();
      newAction.unshift(action);
      this.reactions.next(newAction);
    } else if (action.type === 'Subscription') {
      const newAction = this.subscriptions.getValue();
      newAction.unshift(action);
      this.subscriptions.next(newAction);
    } else if (action.type === 'Post') {
      const newAction = this.posts.getValue();
      newAction.unshift(action);
      this.posts.next(newAction);
    }
  }

  public getNotification = (find?: IFind): Observable<INotification[]> => {
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
    return this.httpClient.get<INotification[]>(`${environment.api.notification.getNotification}${searchString}`);
  }

  private resetNotifications = () => {
    this.notifications.next(null);
    this.comments.next([]);
    this.messages.next([]);
    this.posts.next([]);
    this.reactions.next([]);
    this.subscriptions.next([]);
  }

  private onConnect = () => {
    this.getNotification({ view: true, actionFilter: 'notified-false', populate: 'actions' }).pipe(first()).subscribe(val => {
      if (val && val.length) {
        console.log(val[0]);
        this.notifications.next(val[0]);
        val[0].actions.forEach(action => {
          this.addNotification(action);
        });
      }

    });
  }

  private onNotification = (notification: IAction) => {
    this.addNotification(notification);
  }
}
