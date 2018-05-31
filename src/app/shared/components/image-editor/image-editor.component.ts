import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, ApplicationRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import Cropper from 'cropperjs';
import { ImageUploadService } from './image-upload.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { LoaderService } from '../../services/loader.service';
type photoType = "picture" | "profilePicture" | "postImage" | any;
interface ImageUpload {
  src: string,
  name: string,
  type?: string,
}

@Component({
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  animations: [trigger('welcomeTrigger', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('exit', style({ opacity: 0 })),
    transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
  ]),
  ]
})
export class ImageEditorComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild("image", { read: ElementRef }) image: ElementRef;
  @Output() close = new EventEmitter();
  show = false;
  cropper: Cropper = null;
  photo: ImageUpload = { src: "", name: "" };
  photoType: photoType = '';
  ratios = {
    picture: 1 / 1,
    profilePicture: 4 / 1,
    postImage: 1.78 / 1
  };

  constructor(
    private imageUploadService: ImageUploadService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {

    this.imageUploadService.showImageEditor.subscribe(val => this.photoType = val);
    this.imageUploadService.img.subscribe(val => {
      if (val) {
        this.photo.name = val.name;
        this.photo.src = val.src;
        this.photo.type = val.type;
      }
    });
    this.show = true;
  }

  ngAfterViewInit() {
    this.loaderService.display(false);
    const drag: any = 'move';
    const ratio = this.ratios[this.photoType];
    if (this.photo.src && this.photo.src.length > 0) {
      if (this.image) {
        this.cropper = new Cropper(this.image.nativeElement, {
          restore: false,
          responsive: true,
          aspectRatio: ratio,
          dragMode: drag,
        });
        if (this.cropper.getImageData().naturalWidth < 300) {
          this.onClose();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.cropper.destroy();
  }


  onClose() {
    this.loaderService.display(false);
    this.show = false;
    setTimeout(() => {
      this.imageUploadService.showImageEditor.next('');
      this.close.emit(null);
    }, 600);
  }

  submit(): any {
    if (this.cropper) {
      const crop = this.cropper.getCroppedCanvas({ fillColor: '#ffffff' });
      crop.toBlob(blob => {
        if (this.photoType === 'postImage') {
          this.imageUploadService.imagesToDo.next(new File([blob], this.photo.name, { type: this.photo.type }));
          this.onClose();
        } else {
          var formData = new FormData();
          var file = new File([blob], this.photo.name, { type: this.photo.type });
          formData.append(this.photoType, file);
          this.imageUploadService.upload(formData).then(user => {
            this.onClose();
          }).catch(e => console.log(e));
        }
      });
    }
  }

  public reset(event: any): void {
    if (event && event.target !== event.currentTarget) return;
    this.onClose();
  }
}
