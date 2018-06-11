import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatNavbarComponent } from './navbar/chat/chat-navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ErrorsModule } from './core/errors/errors.module';
import { FeedModule } from './feed/feed.module';
import { HomeComponent } from './home/home.component';
import { ChatFooterComponent } from './navbar/chat/chat-footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './feed/create-post/create-post.component';
import { PostComponent } from './feed/post/post.component';
import { SinglePostComponent } from './single-post/single-post.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ChatNavbarComponent,
    AppComponent,
    HomeComponent,
    ChatFooterComponent,
    SettingsComponent,
    ProfileComponent,
    SinglePostComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ErrorsModule,
    FeedModule
  ],
  providers: [
    Meta,
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
