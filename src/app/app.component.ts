import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;;// = 'LoginPage';
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private storage: Storage
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.storage.get('lsUserName').then(result => {
        console.log('lsUserName: ' + result);
        if (result != null && result != undefined) {
          this.rootPage = 'HomePage';
        } else {
          this.rootPage = 'LoginPage';
        }
      });

      // if ((window.localStorage.getItem("lsUserName") != null) || (window.localStorage.getItem("lsUserName") != undefined)) {
      //   // this.navCtrl.setRoot('HomePage');
      //   this.rootPage = 'HomePage';
      // }else{
      //   this.rootPage = 'LoginPage';
      // }
    });
  }
}

