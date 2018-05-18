import { Component, OnInit, OnDestroy, Input, ViewChildren, ElementRef, QueryList, ChangeDetectorRef } from "@angular/core";
import { ChatService } from "../../shared/services/chat.service";
import { IConversation, IUser } from "../../../interfaces";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NotificationService } from "../../shared/services/notification.service";
import { UserService } from "../../shared/services/user.service";

@Component({
    selector: 'chat-footer',
    templateUrl: './chat-footer.component.html',
    styleUrls: ['./chat-footer.component.scss']
})
export class ChatFooterComponent implements OnInit, OnDestroy {

    @Input() unreaded: string[];
    @ViewChildren('chatLists', { read: ElementRef }) chatLists: QueryList<ElementRef>;

    public user: IUser;
    public messageViewing: IConversation[];
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private destroyList$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private chatService: ChatService,
        private notificationService: NotificationService,
        private changeDetector: ChangeDetectorRef,
        private userService: UserService
    ) { }

    ngOnDestroy(): void {
      this.destroyList$.next(true);
      this.destroyList$.unsubscribe();
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
    }

    ngOnInit(): void {
        this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(val => this.user = val);
        this.chatService.activeConversations.pipe(takeUntil(this.destroy$)).subscribe(val => {
            this.messageViewing = val.reverse();
            if (val.length > 0 && !this.chatLists || this.chatLists && (val.length !== this.chatLists.toArray().length)) {
                this.destroyList$.next(true);
                this.chatLists.changes.pipe(takeUntil(this.destroyList$), takeUntil(this.destroy$)).subscribe(() => {
                    this.chatLists.toArray().map(chatListElement => {
                        if (chatListElement.nativeElement.scrollTop === 0) { chatListElement.nativeElement.scrollTop = chatListElement.nativeElement.scrollHeight; }
                        if (chatListElement.nativeElement.offsetHeight + chatListElement.nativeElement.scrollTop >= chatListElement.nativeElement.scrollHeight - 80) {
                            chatListElement.nativeElement.scrollTop = chatListElement.nativeElement.scrollHeight;
                        }
                    });
                    this.changeDetector.markForCheck();
                });
            }
        });
    }


    public getUser(participants: IUser[]): IUser {
        if (this.user) { return participants.find(val => val.id !== this.user.id); } else { return null; }
    }

    public viewConversation(id: string): void {
        this.viewNotification(id, 'messages');
        this.chatService.viewConversation(id);
    }

    public viewNotification(id: string, type: 'messages' | 'comments' | 'posts' | 'reactions' | 'subscriptions'): void {
        this.notificationService.viewNotification(id, type);
    }

    public removeConversation(id: string): void {
        this.chatService.removeConversation(id);
    }

    public sendMessage(event: any, id: string): void {
        this.chatService.sendMessage(id, event.target.value);
        event.target.value = '';
    }
}
