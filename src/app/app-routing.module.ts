import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SinglePostComponent } from './single-post/single-post.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'welcome', component: FeedComponent },
  { path: 'home', component: HomeComponent },
  { path: 'post/:id', component: SinglePostComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:username', component: ProfileComponent},
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
