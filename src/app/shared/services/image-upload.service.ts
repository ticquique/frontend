import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class ImageUploadService {

  public imgSrc: BehaviorSubject<string> = new BehaviorSubject<string>('');

}
