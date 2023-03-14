import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {FeedComponent} from "./feed/feed.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
  { path:'' ,pathMatch : "full",redirectTo:'login'},
  {path:'feed',component:FeedComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
