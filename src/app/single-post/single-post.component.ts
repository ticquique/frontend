import { Component, OnInit } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { IUser, IPost, IReaction } from "../../interfaces";
import { Subject } from "rxjs";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { UserService } from "../shared/services/user.service";
import { FeedService } from "../shared/services/feed.service";
import { takeUntil, switchMap, first } from "rxjs/operators";
import { ReactionService } from "../shared/services/reaction.service";

@Component({
  selector: 'single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]

})
export class SinglePostComponent implements OnInit {

  user: IUser;
  state: string;
  post: IPost;
  selfReaction: IReaction;
  reactions: IReaction[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private route: ActivatedRoute,
    private reactionService: ReactionService
  ) { }

  ngOnInit(): void {
    this.state = 'enter';
    this.addListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private addListeners() {
    this.route.paramMap.subscribe(params => {

      this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(user => {
        if (user) {
          this.user = user;
        }
        this.feedService.getPost({ resource: `_id-${params.get('id')}`, populate: 'attachments,author,comments' })
          .pipe(first())
          .toPromise()
          .then(post => {
            if (post.length) {
              this.post = post[0];
              this.reactionService.getReaction({ resource: `related-${this.post.id}`, populate: 'user' })
                .pipe(first())
                .toPromise()
                .then(reactions => {
                  this.reactions = reactions;
                  if (user && reactions && reactions.length) {
                    const reaction = this.reactions.find(val => val.user.id === this.user.id);
                    if (reaction) { this.selfReaction = reaction; }
                  }
                }).catch(error => console.log(error))
            }
          }).catch(e => console.log(e));
      });

    });
  }

  public react(related: string, type: 'like' | 'dislike' | 'love' | 'fun') {
    if (this.user) {
      this.reactionService.createReaction(related, type);
      const postReactions = this.post.reactions;
      if (this.selfReaction) {
        if (type === this.selfReaction.type) {
          postReactions[type] = postReactions[type] - 1;
          this.reactions = this.reactions.filter(val => val.user.id !== this.user.id);
          this.selfReaction.type = null;
        } else {
          postReactions[this.selfReaction.type] = postReactions[this.selfReaction.type] - 1;
          postReactions[type] = postReactions[type] + 1;
          this.selfReaction.type = type;
          this.reactions = this.reactions.filter(val => val.user.id !== this.user.id);
          this.reactions.push({reference: 'Post', related: this.post.id, type, user: this.user});
        }
      } else {
        postReactions[type] = postReactions[type] + 1;
        this.selfReaction.type = type;
        this.reactions.push({reference: 'Post', related: this.post.id, type, user: this.user});
      }
    }
  }
}
