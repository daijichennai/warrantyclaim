import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
    )
    {
      // this.platform.registerBackButtonAction(() => {
        
      // });
  }
 
  goToListInvoice(){
    this.navCtrl.push('ListinvoicePage');
  }

  goToListClaims(){
    this.navCtrl.push('ListclaimPage');
  }

  goToBarCode(){
    this.navCtrl.push('BarcodePage');
  }

  settingFn() {
    this.navCtrl.push('SettingsPage');
  }

  ionViewDidLoad() {
    //this.viewCtrl.dismiss();
  }

}
