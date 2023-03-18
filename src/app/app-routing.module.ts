import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeedComponent} from "./feed/feed.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {RegisterSuccessComponent} from "./auth/register-success/register-success.component";
import {HomeComponent} from "./home/home.component";
import {AccountSettingComponent} from "./user/account-setting/account-setting.component";
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";
import {ChangePasswordSuccessComponent} from "./auth/change-password-success/change-password-success.component";

const routes: Routes = [
  { path:'' ,pathMatch : "full",redirectTo:'login'},
  {path:'feed',component:FeedComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'register-success', component:RegisterSuccessComponent},
  {path: 'home' ,redirectTo:'feed'},
  {path:'setting',component:AccountSettingComponent},
  {path:'',component: MainTimeLineComponent},
  {path:'mainTimeLine/:id', component: MainTimeLineComponent},
  {path: 'change-password-success', component: ChangePasswordSuccessComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
