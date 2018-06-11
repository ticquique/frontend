import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { UserService } from '../../../shared/services/user.service';
import { environment } from '../../../../environments/environment';
import { IUser } from '../../../../interfaces';
declare var $: any;
interface FormResult { error: boolean; message: string; }

@Component({
  selector: 'updateProfile-form',
  templateUrl: './updateProfile.component.html',
  styleUrls: ['./updateProfile.component.scss'],
  animations: [
    trigger('enterTrigger', [
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
      state('exit', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
    trigger('alertStatus', [
      state('enter', style({ transform: 'scale(1)', opacity: 1 })),
      state('void', style({ transform: 'scale(.8)', opacity: 0 })),
      state('exit', style({ transform: 'scale(.8)', opacity: 0 })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ]
})

export class UpdateProfileComponent implements OnInit {

  @Output() onHide = new EventEmitter<boolean>();
  @Input() user: IUser;
  state: string;
  profileForm: FormGroup;
  formResult: FormResult;
  alertStatus: string;
  stripeUrl = environment.app.stripe.oauth + '&redirect_uri=http://localhost:4200/?step=2';

  constructor(
    private fb: FormBuilder,
    public translatePipe: TranslatePipe,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.state = 'enter';
    const country = this.user.profile.country || 'none';
    const city = this.user.profile.city || '';
    const gender = this.user.profile.gender || 'none';
    this.profileForm = this.fb.group({
      country: [country],
      city: [city],
      gender: [gender]
    });
  }

  public submit(event?: any): void {
    const values = this.profileForm.value;
    const updates: any = {
      profile: {},
    };
    if (values.country.length && values.country != 'none') { updates.profile.country = values.country; }
    if (values.city.length && values.city != 'none') { updates.profile.city = values.city; }
    if (values.gender.length && values.gender != 'none') { updates.profile.gender = values.gender; }
    this.userService.updateUser(updates).subscribe(
      val => {
        this.userService.user.next(val);
        this.formResult = { error: false, message: 'Correctly updated profile' };
        setTimeout(() => {
          this.formResult = null;
          this.onHide.emit(false);
        }, 1500);
      }, err => {
        console.log(err);
        this.formResult = { error: true, message: 'Invalid password' };
        setTimeout(() => {
          this.formResult = null;
        }, 1500);
      }
    );
  }


  public reset(event: any): void {
    if (event && event.target !== event.currentTarget) return;
    this.onHide.emit(false);
  }
}
