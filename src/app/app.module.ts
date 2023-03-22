import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppComponent } from './app.component';
import {FeedComponent} from "./feed/feed.component";
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterSuccessComponent } from './auth/register-success/register-success.component';
import { HomeComponent } from './home/home.component';
import {environment} from "../environments/environment";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {HttpClientInterceptor} from "./http-client.interceptor";
import {JwtModule} from "@auth0/angular-jwt";
import { AccountSettingComponent } from './user/account-setting/account-setting.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { PhotosComponent } from './photos/photos.component';
import { MainTimeLineComponent } from './main-time-line/main-time-line.component';
import { ChangePasswordSuccessComponent } from './auth/change-password-success/change-password-success.component';
import {FriendDto} from "./model/Dto/FriendDto";
import { CreatPostFormComponent } from './creat-post-form/creat-post-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    RegisterComponent,
    LoginComponent,
    RegisterSuccessComponent,
    HomeComponent,
    AccountSettingComponent,
    AppComponent,
    TimeLineComponent,
    FriendListComponent,
    PhotosComponent,
    MainTimeLineComponent,
    ChangePasswordSuccessComponent,
    CreatPostFormComponent,

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
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpClientInterceptor, multi: true}],
  bootstrap: [AppComponent],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
