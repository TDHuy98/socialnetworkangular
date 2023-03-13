import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShowLoginComponent } from './show-login/show-login.component';
import { ShowRegisterComponent } from './show-register/show-register.component';
import { ServiceComponent } from './service/service.component';
import { ModelComponent } from './model/model.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowLoginComponent,
    ShowRegisterComponent,
    ServiceComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
