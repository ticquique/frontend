import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FeedComponent } from './feed.component';
import { FeedRoutingModule } from './feed-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        FeedRoutingModule
    ],
    declarations: [
        FeedComponent,
        WelcomeComponent
    ],
    providers: []
})
export class FeedModule { }
