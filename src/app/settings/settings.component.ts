import { OnInit, OnDestroy, Component } from "@angular/core";
import { trigger, style, animate, transition, state } from "@angular/animations";
import { UserService } from "../shared/services/user.service";
import { IUser } from "../../interfaces";
import { Subject, BehaviorSubject } from "rxjs";
import { ImageUploadService } from "../shared/services/image-upload.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],

  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class SettingsComponent implements OnInit, OnDestroy {

  user: IUser;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userService: UserService,
    private ImageUploadService: ImageUploadService
  ){}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.userService.user.subscribe(user => this.user = user);
  }

  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.ImageUploadService.imgSrc.next(reader.result);
      };
    }
  }
}
