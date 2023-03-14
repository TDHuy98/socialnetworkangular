import {BrowserModule} from '@angular/platform-browser';
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

@NgModule({
  declarations: [
    AppComponent,
    CommonComponent,
    ContainerComponent,
    AppComponent,
    TimeLineComponent,
    FriendListComponent,
    PhotosComponent,
    MainTimeLineComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    IonicModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class AppModule {
}
