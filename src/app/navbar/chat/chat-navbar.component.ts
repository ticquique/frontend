import { NotificationService } from '../../shared/services/notification.service';
import { IAction } from './../../../interfaces/feed/action';
import { IUser, IConversation } from '../../../interfaces';
import { UserService } from '../../shared/services/user.service';
import { ChatService } from '../../shared/services/chat.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'chat-navbar',
  templateUrl: './chat-navbar.component.html',
  styleUrls: ['./chat-navbar.component.scss']
})
export class ChatNavbarComponent implements OnInit, OnDestroy {

  @Input() unreaded: string[];
  public user: IUser;
  public newConversation = false;
  public conversationList: IConversation[];
  public conversation: IConversation;
  public timeNewMessage: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public newUsers: IUser[] = [];
  public listUsersSearch: [IUser] | IUser[] = [];
  public searchDelay = 500;
  public currentDelay = 500;
  public newChat: FormGroup;
  public focused = false;
  public focusTimeOut: any;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(val => this.user = val);
    this.chatService.conversationList.pipe(takeUntil(this.destroy$)).subscribe(val => this.conversationList = val);
    this.chatService.conversation.pipe(takeUntil(this.destroy$)).subscribe(val => this.conversation = val);
    this.newChat = this.fb.group({
      username: [''],
      message: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public viewConversation(id: string): void {
    this.notificationService.viewNotification(id, 'messages');
    this.chatService.viewConversation(id);
  }

  public isViewed(conversation: IConversation): boolean {
    return this.unreaded.indexOf(conversation.id) >= 0;
  }

  public newConversationToggler(): void {
    event.stopPropagation();
    event.preventDefault();
    this.newConversation = !this.newConversation;
  }

  public getUser(participants: IUser[]): IUser {
    if (this.user) {
      return participants.find(val => val.id !== this.user.id);
    } else { return null; }
  }

  public focusSearch(): void {
    this.focused = true;
    if (this.focusTimeOut) {
      clearTimeout(this.focusTimeOut);
    }
  }

  public blurSearch(): void {
    this.focusTimeOut = setTimeout(() => {
      this.focused = false;
    }, 1000);
  }

  public hideNewMessage(): void {
    this.timeNewMessage = setTimeout(() => {
      this.newUsers = [];
      this.newConversation = false;
    }, 1000);
  }

  public stopTimer(): void {
    clearTimeout(this.timeNewMessage);
  }

  public viewNotification(action: string): void {
    this.notificationService.viewNotification(action, 'messages');
  }

  public submit(): void {
    this.chatService.newChat(this.newUsers.map(val => val.id), this.newChat.get('message').value);
  }

  public newChatUser(user: IUser): void {
    event.stopPropagation();
    if (this.focusTimeOut) {
      clearTimeout(this.focusTimeOut);
    }
    this.listUsersSearch = [];
    this.newChat.get('username').reset();
    this.focused = false;
    if (this.newUsers.indexOf(user) < 0) {
      this.newUsers.push(user);
    }
  }

  public deleteNewUser(user: IUser): void {
    event.stopPropagation();
    event.preventDefault();
    this.newUsers.splice(this.newUsers.indexOf(user), 1);
  }

  public searcher(event?: KeyboardEvent): void {
    const search = this.newChat.get('username').value;
    if (event && event.key === 'Backspace' && search && search.length === 0) {
      this.listUsersSearch = [];
    }
    if (this.currentDelay === 0 && search) {
      this.userService.getUser({ partial: true, page: 1, perPage: 5, resource: `username-${search}` }).subscribe(users => {
        users = users.filter(val => val.id !== this.user.id && this.conversationList.filter(conversation => conversation.participants.find(participant => participant.id === val.id)).length === 0);
        this.listUsersSearch = users;
      });
      this.currentDelay = this.searchDelay;
    } else if (this.currentDelay === this.searchDelay) {
      this.currentDelay--;
      setTimeout(() => {
        this.currentDelay = 0;
        this.searcher();
      }, this.currentDelay);
    }
  }
}
