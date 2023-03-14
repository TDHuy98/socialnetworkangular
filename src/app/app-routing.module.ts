import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainTimeLineComponent} from "./main-time-line/main-time-line.component";

const routes: Routes = [

  {path:'',component: MainTimeLineComponent},
  {path:'mainTimeLine/:id', component: MainTimeLineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
