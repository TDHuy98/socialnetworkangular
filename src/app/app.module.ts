import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ShowLoginComponent} from './auth/show-login/show-login.component';
import {ShowRegisterComponent} from './auth/show-register/show-register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonComponent} from './common/common.component';
import {ContainerComponent} from './container/container.component';
import {IonicModule} from "@ionic/angular";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ShowLoginComponent,
    ShowRegisterComponent,
    CommonComponent,
    ContainerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: "register", component: ShowRegisterComponent},
      {path: "login", component: ShowLoginComponent}
    ]),
    IonicModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
