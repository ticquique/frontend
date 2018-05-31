import { ChatService } from './../shared/services/chat.service';
import { IConversation } from './../../interfaces/chat/conversation';
import { IAction } from './../../interfaces/feed/action';
import { NotificationService } from '../shared/services/notification.service';
import { UserService } from '../shared/services/user.service';
import { IUser } from './../../interfaces/user';
import { Component, OnInit, HostListener, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslationService } from '../shared/services/translation.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],

  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public state: string;
  public title = environment.app.name;
  public isHome = true;
  public user: IUser;
  public languajes: string[];
  public messages: string[] = [];
  public comments: IAction[] = [];
  public reactions: IAction[] = [];
  public subscriptions: IAction[] = [];

  public currentWindowWidth = 0;
  public search: string = '';
  public listUsersSearch: [IUser] | IUser[] = [];
  public displaySearch = false;
  public focused = false;
  public searchDelay = 1000;
  public currentDelay = 1000;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    public translationService: TranslationService,
    private userService: UserService,
    private notificationService: NotificationService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
    this.languajes = this.translationService.languages;
    this.notificationService.messages.pipe(takeUntil(this.destroy$)).subscribe(messages => this.messages = messages.filter(message => !message.viewed).map(val => val.object)); // tslint:disable-line:max-line-length
    this.notificationService.comments.pipe(takeUntil(this.destroy$)).subscribe(comments => { this.comments = comments.filter(comment => !comment.viewed); });
    this.notificationService.reactions.pipe(takeUntil(this.destroy$)).subscribe(reactions => { this.reactions = reactions.filter(reaction => !reaction.viewed); }); // tslint:disable-line:max-line-length
    this.notificationService.subscriptions.pipe(takeUntil(this.destroy$)).subscribe(subscriptions => { this.subscriptions = subscriptions.filter(subscription => !subscription.viewed); }); // tslint:disable-line:max-line-length
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(user => this.user = user);
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val instanceof NavigationEnd) { if (val.url === '/home') { this.isHome = true; } else { this.isHome = false; } }
    });
    this.state = 'enter';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public reset(type: 'messages' | 'comments' | 'posts' | 'reactions' | 'subscriptions'): void {
    this.notificationService.viewNotifications(type);
  }
  public logOut(): void { this.authService.logout(); }
  public changeLang(lang: string): void { this.translationService.language = lang; }
  public resetSearcher(): void { this.search = ''; this.listUsersSearch = null; }
  public onUnfocus(): void { setTimeout(() => { this.focused = false; }, 100); }
  public onBlur(): void { this.focused = false; if (this.currentWindowWidth > 500) { this.displaySearch = false; } }
  public onFocus(): void {
    this.focused = true;
    if (this.currentWindowWidth > 500) { this.displaySearch = true; }
  }

  @HostListener('window:resize')
  public onResize(): void {
    if (window.innerWidth > 500 && this.currentWindowWidth <= 500) { this.displaySearch = false; }
    this.currentWindowWidth = window.innerWidth;
  }

  public searcher(event?: KeyboardEvent): void {
    if (event && event.key === 'Backspace' && this.search.length === 0) {
      this.listUsersSearch = [];
    }
    if (this.currentDelay === 0 && this.search && this.search.length > 0) {
      this.userService.getUser({ partial: true, resource: `username-${this.search}`, page: 1, perPage: 5 }).subscribe(users => {
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

  click($event: Event) {
    let target: HTMLInputElement = <HTMLInputElement>$event.target;
    target.click();
  }

}
