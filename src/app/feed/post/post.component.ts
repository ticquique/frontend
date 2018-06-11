import { OnInit, Component, Input, ViewChild, ElementRef } from "@angular/core";
import { state, style, animate, transition, trigger } from "@angular/animations";
import { IAction, IPost, IUser, IReaction, IComment } from "../../../interfaces";
import { ReactionService } from "../../shared/services/reaction.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CommentsService } from "../../shared/services/comments.service";
import { first } from "rxjs/operators";

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
  postComment: string;
  comments: IComment;
  commentsLimit = 2;
  state: string;
  reaction: 'like' | 'dislike' | 'love' | 'fun' | '';

  constructor(
    public reactionService: ReactionService,
    public sanitizer: DomSanitizer,
    public commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.state = 'enter';
    this.showComments(this.post.id).then(val => {
      if (val.length) { this.comments = val[0]; }
    }).catch(e => console.log(e));
    if (this.user) {
      this.reactionService.getReaction({ resource: `user-${this.user.id};related-${this.post.id}` }).subscribe(reactions => {
        if (reactions && reactions.length) {
          this.reaction = reactions[0].type;
        }
      });
    }
  }

  public showComments(id: string): Promise<IComment[]> {
    return new Promise<IComment[]>((resolve, reject) => {
      this.commentsService.getComment({ resource: `discussionId-${id}` }).pipe(first()).subscribe(val => {
        if (val && val.length) { resolve(val) } else { reject() }
      })
    });
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

  public sendComment(object: string): void {
    if (this.user && this.postComment.length) {
      this.commentsService.createComment(object, this.postComment, this.user.username).then(val => {
        this.comments.comments.unshift(val);
        this.postComment = '';
      }).catch(e => console.log(e));
    }
  }

}
