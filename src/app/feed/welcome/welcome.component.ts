import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { UserService } from '../../shared/services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../../interfaces';
declare var $: any;
interface FormResult { error: boolean; message: string; }
@Component({
  selector: 'welcome-form',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [
    trigger('welcomeTrigger', [
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
      state('exit', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
    trigger('alertStatus', [
      state('enter', style({ transform: 'scale(1)', opacity: 1 })),
      state('void', style({ transform: 'scale(.95)', opacity: 0 })),
      state('exit', style({ transform: 'scale(.95)', opacity: 0 })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ]
})
export class WelcomeComponent implements OnInit {

  @Output() showWelcome = new EventEmitter<boolean>();
  @Input() step;
  @Input() user: IUser;
  show = true;
  state: string;
  constructor(
    public router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.state = 'enter';
  }

  onHide(val: boolean) {
    this.show = false;
    setTimeout(() => {
      this.showWelcome.emit(false);
    }, 400);
  }

  onNext(step?: number) {
    this.step = step || this.step + 1;
  }

  public reset(event: any): void {
    if (event && event.target !== event.currentTarget) return;
    this.show = false;
    setTimeout(() => {
      this.showWelcome.emit(false);
    }, 400);
  }
}
