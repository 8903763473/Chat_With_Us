import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Push } from '@ionic-native/push/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { RegisterComponent } from './register/register.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { ContactsComponent } from './contacts/contacts.component';


@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, RecoveryComponent, ContactsComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgOtpInputModule, HttpClientModule, CommonModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseX,
    Push,
    Platform, HttpClient
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
