import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import {FeedComponent} from "./feed/feed.component";
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {CommonComponent} from './common/common.component';
import {ContainerComponent} from './container/container.component';
import {HttpClientModule} from "@angular/common/http";
import {IonicModule} from "@ionic/angular";
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { TimeLineComponent } from './time-line/time-line.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { PhotosComponent } from './photos/photos.component';
import { MainTimeLineComponent } from './main-time-line/main-time-line.component';
import {IonicModule} from "@ionic/angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import { HomeComponent } from './home/home.component';
import {HttpClientInterceptor} from "./http-client.interceptor";
import {JwtModule} from "@auth0/angular-jwt";
import { AccountSettingComponent } from './user/account-setting/account-setting.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    CommonComponent,
    ContainerComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,
    AccountSettingComponent,
    AppComponent,
    TimeLineComponent,
    FriendListComponent,
    PhotosComponent,
    MainTimeLineComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JwtModule,
    JwtModule.forRoot({
      config: {
        tokenGetter:  () => localStorage.getItem('authenticationToken')
      }
    }),
    RouterModule.forRoot([]),
    HttpClientModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true}],
  bootstrap: [AppComponent],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
