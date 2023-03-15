import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostComponent} from "./post/post.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {path:'post',component:PostComponent},
  {path:'*', component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
