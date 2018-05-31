import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "../../services/user.service";
import { IUser } from "../../../../interfaces";
import { LoaderService } from "../../services/loader.service";

interface imageUpload {
  src: string,
  file: File,
  name: string,
  type?: string,
}

@Injectable()
export class ImageUploadService {

  user: IUser;
  showImageEditor: BehaviorSubject<string> = new BehaviorSubject<string>('');
  img: BehaviorSubject<imageUpload> = new BehaviorSubject<imageUpload>(null);
  imagesToDo: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  constructor(
    public userService: UserService
  ) {
    userService.user.subscribe(user => {
      this.user = user;
      if (!user) {
        this.showImageEditor.next('');
        this.img.next(null);
        this.imagesToDo.next(null);
      }
    });
  }

  public upload(data): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      this.userService.updateUser(data).subscribe(
        val => { this.userService.user.next(val); resolve(val); }),
        err => { reject(err); }
    });
  }
}
