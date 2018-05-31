import { OnInit, OnDestroy, Component, HostListener, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { trigger, style, animate, transition, state } from "@angular/animations";
import { UserService } from "../shared/services/user.service";
import { IUser } from "../../interfaces";
import { Subject, BehaviorSubject } from "rxjs";
import { ImageUploadService } from "../shared/components/image-editor/image-upload.service";
import { ActivatedRoute, Router } from "@angular/router";
import { first, takeUntil } from "rxjs/operators";
import { LoaderService } from "../shared/services/loader.service";

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
    state('exit', style({transform: 'scale(0)', opacity: 0 })),
    transition('* => *', animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  scrollTop: number;
  sticked: boolean;
  user: IUser;
  profileUser: IUser;
  state: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild("navUser", { read: ElementRef }) navUser: ElementRef;
  @ViewChild("profileHeader", { read: ElementRef }) profileHeader: ElementRef;

  constructor(
    private userService: UserService,
    private ImageUploadService: ImageUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService
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
              if (val && val.length) { this.profileUser = val[0] }
            })
          } else if (user) {
            this.profileUser = this.user;
          }
        }, (err) => { console.log(err); });
    });
    this.state = 'enter';
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
