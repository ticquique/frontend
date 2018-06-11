import { OnInit, OnDestroy, Component, HostListener, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, style, animate, transition, state } from "@angular/animations";
import { UserService } from "../shared/services/user.service";
import { IUser, ISubscription } from "../../interfaces";
import { Subject, BehaviorSubject } from "rxjs";
import { ImageUploadService } from "../shared/components/image-editor/image-upload.service";
import { ActivatedRoute, Router } from "@angular/router";
import { first, takeUntil } from "rxjs/operators";
import { LoaderService } from "../shared/services/loader.service";
import { SubscriptionService } from "../shared/services/subscription.service";
import { DonativeService } from "../shared/services/donative.service";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('1200ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  trigger('navTrigger', [
    state('enter', style({ transform: 'scale(1)', opacity: 1 })),
    state('void', style({ transform: 'scale(0)', opacity: 0 })),
    state('exit', style({ transform: 'scale(0)', opacity: 0 })),
    transition('* => *', animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  handler: any;
  amount = 500;
  donate = false;
  scrollTop: number;
  tabPage: string;
  sticked: boolean;
  user: IUser;
  profileUser: IUser;
  state: string;
  subscribeds: ISubscription[];
  ProfileSubscribeds: ISubscription[];
  ProfileSubscribers: ISubscription[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild("navUser", { read: ElementRef }) navUser: ElementRef;
  @ViewChild("profileHeader", { read: ElementRef }) profileHeader: ElementRef;

  constructor(
    private userService: UserService,
    private ImageUploadService: ImageUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private subscriptionService: SubscriptionService,
    private donativeService: DonativeService,
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    this.scrollTop = Math.round(window.pageYOffset);
  }

  ngOnInit(): void {
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      this.route.params.subscribe(
        (params) => {
          if ((params['username']) || (params['username'] && user && user.username !== params['username'])) {
            this.userService.getUser({ resource: `username-${params['username']}` }).subscribe(val => {
              if (val && val.length) {
                this.profileUser = val[0];
                if (this.profileUser.profile.stripe) {
                  const configureOptions: any = {};
                  configureOptions.key = environment.app.stripe.pubKey;
                  configureOptions.image = 'assets/img/logo/donative.png';
                  configureOptions.locale = 'auto';
                  configureOptions.allowRememberMe = false;
                  configureOptions.token = token => {
                    this.createDonative(this.profileUser.profile.stripe.stripe_user_id, this.amount, this.donate, token.id, token.email);
                  };
                  if (user) {
                    configureOptions.email = user.email;
                  }
                  this.handler = StripeCheckout.configure(configureOptions);
                }
                this.subscriptionService.getSubscriptions({
                  resource: `subscribable-${this.profileUser.id}`,
                  populate: 'subscriber'
                }).pipe(first()).subscribe(subscribers => {
                  this.ProfileSubscribers = subscribers;
                });
                this.subscriptionService.getSubscriptions({
                  resource: `subscriber-${this.profileUser.id}`,
                  populate: 'subscribable'
                }).pipe(first()).subscribe(subscribeds => {
                  this.ProfileSubscribeds = subscribeds;
                });
              }
            });
          } else if (user) {
            this.profileUser = this.user;
            this.subscriptionService.subscribeds.pipe(takeUntil(this.destroy$)).subscribe(subscribeds => {
              this.ProfileSubscribeds = subscribeds;
            });
            this.subscriptionService.subscribers.pipe(takeUntil(this.destroy$)).subscribe(subscribers => {
              this.ProfileSubscribers = subscribers;
            });
          }
        }, (err) => { console.log(err); });
      if (user) {
        this.subscriptionService.subscribeds.pipe(takeUntil(this.destroy$)).subscribe(subscribeds => {
          this.subscribeds = subscribeds;
        });
      }
    });
    this.state = 'enter';
  }

  @HostListener('window:popstate')
  onPopstate() {
    if (this.handler) {
      this.handler.close();
    }
  }

  onChange(event: EventTarget, type: 'profilePicture' | 'picture') {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.loaderService.display(true);
    if (files && files.length > 0) {
      const file = files[0];
      target.value = "";
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.ImageUploadService.showImageEditor.next(type);
        this.ImageUploadService.img.next({
          src: reader.result,
          name: file.name,
          type: file.type,
          file
        });
      };
    }
  }

  public subscribe(id: string) {
    if (this.user) {
      if (this.isSubscribed(id)) {
        this.ProfileSubscribers = this.ProfileSubscribers.filter(val => {
          const subscribableAuthor: any = val.subscribable;
          subscribableAuthor.id !== id
        });
      } else {
        const profileUser: any = this.profileUser;
        const subscriptionAux: ISubscription = { subscribable: profileUser.id, subscriber: this.user }
        this.ProfileSubscribers.unshift(subscriptionAux);
      }
    }
    this.subscriptionService.createSubscription(id);
  }

  public openHandler() {
    console.log(this.user.profile.stripe);
    if (this.user.profile.stripe && this.user.profile.stripe.customer_token) {
      this.createDonative(this.profileUser.profile.stripe.stripe_user_id, this.amount, this.donate);
    } else {
      this.handler.open({
        name: 'inarts',
        description: 'Support author',
        currency: 'eur',
        amount: this.amount,
      });
    }
  }

  public createDonative(account: string, amount: number, donate?: boolean, token?: string, email?: string): any {
    this.donativeService.createCharge(account, amount, donate, token, email).subscribe(val => {
      console.log(val);
    });
  }

  public isSubscribed(id: string): boolean {
    return (this.subscribeds && this.subscribeds.find(val => val.subscribable.id === id) !== undefined);
  }


  public changePage(page: 'posts' | 'following' | 'followers') {
    this.tabPage = page;
  }

  @HostListener('window:scroll', ['$event'])
  public onResize() {
    this.scrollTop = Math.round(window.pageYOffset);
    if (this.navUser && (this.scrollTop !== this.navUser.nativeElement.offsetTop - 120 && this.sticked)) {
      this.sticked = false;
      this.profileHeader.nativeElement.classList.remove('sticked');
    } else if (this.navUser && (!this.sticked && this.scrollTop === this.navUser.nativeElement.offsetTop - 120)) {
      this.sticked = true;
      this.profileHeader.nativeElement.classList.add('sticked');
    }
  }
}
