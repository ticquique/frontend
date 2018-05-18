import { IUser } from './../../interfaces/user';
import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [trigger('welcomeTrigger', [
      state('enter', style({  opacity: 1 })),
      state('void', style({ opacity: 0 })),
      state('exit', style({ opacity: 0 })),
      transition('* => *', animate('800ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ]
})
export class HomeComponent implements OnInit {

  public currentWindowWidth: number;
  public title = environment.app.name;
  public state: string;

  ngOnInit(): void {
    this.currentWindowWidth = window.innerWidth;
    this.state = 'enter';
  }

  @HostListener('window:resize')
  public onResize(): void {
    this.currentWindowWidth = window.innerWidth;
  }

}
