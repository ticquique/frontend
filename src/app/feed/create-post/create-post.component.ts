import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from "@angular/core";
import { trigger, style, state, transition, animate } from "@angular/animations";
import { Subject } from "rxjs";
import { ImageUploadService } from "../../shared/components/image-editor/image-upload.service";
import { LoaderService } from "../../shared/services/loader.service";
import { takeUntil } from "rxjs/operators";
import { IUser } from "../../../interfaces";
import { FeedService } from "../../shared/services/feed.service";
import { UserService } from "../../shared/services/user.service";
import { Router } from "@angular/router";

interface FilePost {
  type: string;
  file: File;
  src?: string;
}

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]

})
export class CreatePostComponent implements OnInit, OnDestroy {

  user: IUser;
  state: string;
  showNewPost = false;
  filesPost: FilePost[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild("postText", { read: ElementRef }) postText: ElementRef;

  constructor(
    private imageUploadService: ImageUploadService,
    private loaderService: LoaderService,
    private feedService: FeedService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.userService.user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.user = user;
      if (user) {
        this.state = 'enter';
        this.imageUploadService.imagesToDo.pipe(takeUntil(this.destroy$)).subscribe(val => {
          if (val) {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(val);
            reader.onload = () => {
              const file: FilePost = { type: 'image', file: val, src: reader.result };
              this.filesPost.push(file);
            }
          }
        });
      } else {
        this.showNewPost = false;
        this.filesPost = [];
      }
    });
  }

  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.loaderService.display(true);
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      if ((/\.(gif|jpg|jpeg|tiff|png)$/i).exec(target.value)) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageUploadService.showImageEditor.next('postImage');
          this.imageUploadService.img.next({
            src: reader.result,
            name: file.name,
            type: file.type,
            file
          });
        }
      } else if (target.value.endsWith('.docx')) {
        const filePost: FilePost = { file, type: 'word' }
        this.filesPost.push(filePost);
        this.loaderService.display(false);
      } else if (target.value.endsWith('.pdf')) {
        const filePost: FilePost = { file, type: 'pdf' }
        this.filesPost.push(filePost);
        this.loaderService.display(false);
      }
      target.value = "";
    }
  }

  removeFile(event: EventTarget, file: FilePost): void {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    target.classList.add('removing');
    setTimeout(() => {
      this.filesPost = this.filesPost.filter(val => val !== file);
    }, 1000);
  }

  createPost(): void {
    const formData = new FormData();
    this.filesPost.forEach(val => {
      console.log(val);
      formData.append('files', val.file);
    });
    formData.append('title', this.postText.nativeElement.textContent);
    this.feedService.createPost(formData).then(val => {
      this.postText.nativeElement.textContent = '';
      this.filesPost = [];
      this.router.navigate([`/post/${val.id}`]);
    }).catch(e => console.log(e));
  }

  toggleNewPost(): void {
    if (this.postText.nativeElement.textContent.length === 0) {
      this.showNewPost = false;
    }
  }
}
