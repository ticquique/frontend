import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { IUser, IFeed, IPost } from '../../interfaces';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ImageUploadService } from '../shared/components/image-editor/image-upload.service';
import { LoaderService } from '../shared/services/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FeedService } from '../shared/services/feed.service';
import { DonativeService } from '../shared/services/donative.service';

interface FilePost {
  src: string;
  type: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]

})
export class FeedComponent implements OnInit {

  user: IUser;
  state: string;
  showWelcome = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  feed: IFeed;
  postList: IPost[];
  step = 1;

  constructor(
    private router: Router,
    private userService: UserService,
    private feedService: FeedService,
    private route: ActivatedRoute,
    private donativeService: DonativeService
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
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.user = user;
        this.feedService.feed.pipe(takeUntil(this.destroy$)).subscribe(feed => {
          this.feed = feed;
          if (feed && feed.actions) {
            this.postList = feed.actions.map(action => action.object);
          }
        });
        this.route.queryParams.subscribe(val => {
          if (val.scope && val.code) {
            this.donativeService.createCustomer(val.code, val.scope).subscribe(val => {
              this.userService.user.next(val);
            });
          }
          if (val.step || val.showWelcome) {
            if (val.showWelcome) {
              this.showWelcome = (val['showWelcome'] === 'true');
            }
            if (val.step) {
              this.showWelcome = true;
              this.step = val['step'];
            }
            this.router.navigate(['/']);
          }
        });
      } else {
        this.feedService.getPost({ page: 1, perPage: 50, populate: 'attachments,author' }).pipe(takeUntil(this.destroy$)).subscribe(postList => {
          this.postList = postList;
        });
      }
    });
  }

  public hideWelcome() {
    this.showWelcome = false;
  }
}
