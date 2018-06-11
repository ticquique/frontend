import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { UserService } from '../../../shared/services/user.service';
declare var $: any;
interface FormResult { error: boolean; message: string; }
@Component({
  selector: 'changePassword-form',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss'],
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
export class ChangePasswordComponent implements OnInit {

  @Output() onHide = new EventEmitter<boolean>();
  @Output() onNext = new EventEmitter<boolean>();
  welcomeForm: FormGroup;
  formResult: FormResult;
  alertStatus: string;
  state: string;

  constructor(
    private fb: FormBuilder,
    public translatePipe: TranslatePipe,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.welcomeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      matchingPasswords: this.fb.group({
        newPassword: ['', Validators.required],
        rePassword: ['', Validators.required]
      }, { validator: this.matchValidator })
    });
  }

  matchValidator(group: FormGroup) {
    return group.get('newPassword').value === group.get('rePassword').value ? null : { 'mismatch': true };
  }


  public submit(event?: any): void {
    const values = this.welcomeForm.value;
    this.userService.updatePassword({
      lastPassword: values.oldPassword,
      newPassword: values.matchingPasswords.newPassword,
      rePassword: values.matchingPasswords.rePassword
    }).subscribe(
      val => {
        this.formResult = { error: false, message: 'Correctly updated password' };
        setTimeout(() => {
          this.formResult = null;
          this.onNext.emit();
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
    this.onNext.emit();
  }

}
