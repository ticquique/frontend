import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { state, style, animate, transition, trigger } from "@angular/animations";
import { IAction, IPost, IUser, IReaction } from "../../../interfaces";
import { ReactionService } from "../../shared/services/reaction.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CommentsService } from "../../shared/services/comments.service";

@Component({
  selector: 'single-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class PostComponent implements OnInit {

  @Input() action: IAction;
  @Input() post: IPost;
  @Input() user: IUser;
  @ViewChild("likeWrapper", { read: ElementRef }) likeWrapper: ElementRef;
  @ViewChild("dislikeWrapper", { read: ElementRef }) dislikeWrapper: ElementRef;
  @ViewChild("likeIcon", { read: ElementRef }) likeIcon: ElementRef;
  @ViewChild("dislikeIcon", { read: ElementRef }) dislikeIcon: ElementRef;
  state: string;
  reaction: 'like' | 'dislike' | 'love' | 'fun' | '';

  constructor(
    public reactionService: ReactionService,
    public sanitizer: DomSanitizer,
    public commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.state = 'enter';
    if (this.user) {
      this.reactionService.getReaction({ resource: `user-${this.user.id};related-${this.post.id}` }).subscribe(reactions => {
        if (reactions && reactions.length) {
          this.reaction = reactions[0].type;
        }
      });
    }
  }

  public react(related: string, type: 'like' | 'dislike' | 'love' | 'fun') {
    if (this.user) {
      this.reactionService.createReaction(related, type);
      const postReactions = this.post.reactions;
      if (this.reaction) {
        if (type === this.reaction) {
          postReactions[type] = postReactions[type] - 1;
          this.reaction = '';
        } else {
          postReactions[this.reaction] = postReactions[this.reaction] - 1;
          postReactions[type] = postReactions[type] + 1;
          this.reaction = type;
        }
      } else {
        postReactions[type] = postReactions[type] + 1;
        this.reaction = type;
      }
    }
  }

  public sendComment(object: string, text: string): void {
    if (this.user) {
      this.commentsService.createComment(object, text, this.user.username);
    }
  }

}
