import { arrayMove } from './../../../../utils/arrayUtils';
import { NotificationService } from './notification.service';
import { IAction } from './../../../interfaces/feed/action';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IFind, IMessage, IUser } from '../../../interfaces';
import { environment } from './../../../environments/environment';
import { IConversation } from './../../../interfaces/chat/conversation';
import { SocketService } from './socket.service';
import { ValueTransformer } from '@angular/compiler/src/util';
import { UserService } from './user.service';
const status = { offline: 'offline', online: 'online', away: 'away', busy: 'busy' };

@Injectable()
export class ChatService {

  public user: IUser;
  public socket: SocketIOClient.Socket;
  public status: string = status.offline;
  public conversation: BehaviorSubject<IConversation> = new BehaviorSubject<IConversation>(null);
  public conversationList: BehaviorSubject<IConversation[]> = new BehaviorSubject<IConversation[]>([]);
  public activeConversations: BehaviorSubject<IConversation[]> = new BehaviorSubject<IConversation[]>([]);

  constructor(
    private socketService: SocketService,
    private httpClient: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.userService.user.subscribe(user => this.user = user);
    this.socketService.socket.subscribe(socket => {
      this.socket = socket;
      if (socket) {
        this.addListeners(socket);
      } else {
        this.status = status.offline;
        this.conversation.next(null);
        this.conversationList.next([]);
        this.activeConversations.next([]);
      }
    });
  }

  public getChat = (find?: IFind): Observable<IConversation[]> => {
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
    return this.httpClient.get<IConversation[]>(`${environment.api.chat.getChats}${searchString}`);
  }

  public getMessages = (find?: IFind): Observable<IMessage[]> => {
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
    return this.httpClient.get<IMessage[]>(`${environment.api.chat.getMessages}${searchString}`);
  }

  public sendMessage(conversation: string, body: string): void {
    this.socket.emit('sendMessage', { conversation, body });
  }

  public newChat(users: string[], message: string): void {
    this.socket.emit('newChat', { id: users, message: { body: message } });
  }

  public viewConversation(id: string): void {
    const conversation = this.conversationList.getValue().find(val => val.id === id);
    const isActive = this.activeConversations.getValue().find(val => val.id === id);
    if (conversation && !isActive) {
      if (conversation.listMessages.length < 20) {
        this.getMessages({
          resource: `conversation-${conversation.id}`, populate: 'author', page: 1, perPage: 20, sort: '-createdAt'
        }).subscribe(val => {
          if (val) {
            conversation.listMessages = val;
            conversation.lastMessage = val[0];
          }
        });
      }
      const aux = this.activeConversations.getValue();
      aux.push(conversation);
      this.activeConversations.next(aux);
    } else if (isActive) {
      const aux = this.activeConversations.getValue();
      arrayMove(aux, aux.indexOf(isActive), 0);
      this.activeConversations.next(aux);
    }
  }

  public removeConversation(id: string): void {
    this.activeConversations.next(this.activeConversations.getValue().filter(val => val.id !== id));
  }

  public onNewMessage(message: IMessage): void {
    const conversationList = Object.assign([], this.conversationList.getValue());
    let indexLoop = -1;
    const author = typeof message.author === 'string' ? message.author : message.author.id;
    if (this.user && this.user.id !== author) {
      const action: IAction = {
        IsHidden: false, relevancy: 0, notified: true, user: author, type: 'Message', object: message.conversation, createdAt: message.createdAt
      };
      this.notificationService.addNotification(action);
    }
    if (this.conversation.getValue() && this.conversation.getValue().id === message.conversation) {
      const conversation = Object.assign({}, this.conversation.getValue());
      conversation.lastMessage = message;
      conversation.listMessages.unshift(message);
    }
    const modified = conversationList.map((val, index) => {
      if (val.id === message.conversation) {
        val.lastMessage = message;
        val.listMessages.unshift(message);
        indexLoop = index;
        return val;
      } else {
        return val;
      }
    });
    if (indexLoop > -1) {
      arrayMove(modified, indexLoop, 0);
      this.conversationList.next(modified);
    } else {
      this.getChat({ resource: `_id-${message.conversation}`, populate: 'participants' }).subscribe(val => {
        console.log(val);
        if (val.length) {
          val[0].lastMessage = message;
          val[0].listMessages = [message];
          modified.unshift(val[0]);
          this.conversationList.next(modified);
        }
      });
    }
  }

  private addListeners(socket: SocketIOClient.Socket): void {
    if (socket.connected) { this.onConnect(); }
    socket.on('connect', () => this.onConnect());
    socket.on('disconnect', () => this.onDisconnect());
    socket.on('newMessage', (data) => this.onNewMessage(data));
  }

  private onDisconnect(): void {
    this.status = status.offline;
    this.conversationList.next([]);
    this.conversation.next(null);
  }

  private onConnect(): void {
    this.status = status.online;
    this.getChat({ populate: 'participants', sort: '-updatedAt' }).subscribe(val => {
      if (val.length) {
        val.map((conversation, index) => {
          let numMessages = 1;
          if (index === val.length) { numMessages = 20; }
          this.getMessages({
            resource: `conversation-${conversation.id}`, perPage: numMessages, page: 1, sort: '-createdAt'
          }).subscribe(messages => {
            if (messages.length) {
              conversation.lastMessage = messages[0];
              conversation.listMessages = messages;
              this.conversationList.next(this.conversationList.getValue().concat(conversation));
            }
          });
        });
      }
    });
  }

}
