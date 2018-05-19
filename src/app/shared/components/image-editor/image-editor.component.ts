import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import Cropper from 'cropperjs';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent implements AfterViewInit {

  cropper: Cropper = null;
  imgSrc: string;
  @ViewChild("image", { read: ElementRef }) image: ElementRef;

  constructor(
    private imageUploadService: ImageUploadService
  ) { }

  ngAfterViewInit(): void {

    this.imageUploadService.imgSrc.subscribe(val => {
      if (this.cropper) { this.cropper.destroy(); }
      if (val && val.length > 0) {
        this.imgSrc = val;
        const drag: any = 'move';
        setTimeout(() => {
          this.cropper = new Cropper(this.image.nativeElement, {
            viewMode: 1,
            responsive: true,
            aspectRatio: 1 / 1,
            dragMode: drag,
            crop: function (event) {
              console.log(event.detail.x);
              console.log(event.detail.y);
              console.log(event.detail.width);
              console.log(event.detail.height);
              console.log(event.detail.rotate);
              console.log(event.detail.scaleX);
              console.log(event.detail.scaleY);
            }
          });
        }, 100);
      }
    })

  }
}
