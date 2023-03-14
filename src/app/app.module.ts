import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonComponent} from './common/common.component';
import {ContainerComponent} from './container/container.component';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    ContainerComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path:'register', component: RegisterComponent},
      {path:'register-success', component:RegisterSuccessComponent},
      {path:'login', component:LoginComponent},
      {path: 'home' ,component:HomeComponent},
      {path: '' ,component:HomeComponent}
    ]),
    IonicModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
