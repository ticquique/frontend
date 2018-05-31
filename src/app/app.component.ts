import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from './shared/components/image-editor/image-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showImageUploader: string;
  showUploader:boolean = true;

  constructor (
    private imageUploadService: ImageUploadService
  ) {}

  ngOnInit(): void {
    this.imageUploadService.showImageEditor.subscribe(val => {
      this.showUploader = true;
      this.showImageUploader = val;
    });
  }
}
