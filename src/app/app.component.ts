import { Component } from '@angular/core';


import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
//import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( private platform: Platform,private router : Router) {
    this.initializeApp();

  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('login');
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          //console.log('hello');
        }, false);
      });

    });
  }

}
