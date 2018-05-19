import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FeedComponent } from './feed/feed.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'welcome', component: FeedComponent },
  { path: 'home', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
