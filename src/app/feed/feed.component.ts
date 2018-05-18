import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { IUser } from '../../interfaces';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  animations: [trigger('welcomeTrigger', [
      state('enter', style({  opacity: 1 })),
      state('void', style({ opacity: 0 })),
      state('exit', style({ opacity: 0 })),
      transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ]

})
export class FeedComponent implements OnInit {

  public user: IUser;
  public showWelcome = false;
  state: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(user => {
      if (user) {
        this.user = user;
        if (this.router.url === '/welcome') { this.showWelcome = true; }
      } else { this.user = null; }
    });
    this.state = 'enter';
  }


}
