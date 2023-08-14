/*
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
*/


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';



import { Lang } from './services/lang';
import { GitHubService } from './services/git-hub-service';
import { AuthenticationService } from './services/authentication-service';
import { Storage } from '@ionic/storage';
//import { IonicStorageModule } from '@ionic/storage';
//import { IonicStorageModule } from '@ionic/storage-angular';
//import { Storage } from '@ionic/storage-angular';

//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@capacitor/geolocation';

//import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx'

import { HttpClient, HttpClientModule, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';



//toEnable
//import { OneSignal } from '@ionic-native/onesignal/ngx';
//,IonicStorageModule.forRoot()

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClient,HttpClientModule,
    Lang,
    GitHubService,
    AuthenticationService,
    LaunchNavigator,
    Storage
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
