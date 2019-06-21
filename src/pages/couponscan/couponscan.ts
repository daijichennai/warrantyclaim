import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
@IonicPage()
@Component({
  selector: 'page-couponscan',
  templateUrl: 'couponscan.html',
})
export class CouponscanPage {
  public scannedData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    public myFunc: CommfuncProvider,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    ) {
  }
  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponscanPage');
  }

  scanCouponQrCode(){
    let options = {
      resultDisplayDuration: 0,
      showTorchButton: true,
      showFlipCameraButton: true,
      prompt: "Scanning Your QR Code"
    };

    this.barcodeScanner.scan(options).then(qrData => {
      //this.scannedData = JSON.stringify(qrData);
      this.chkClaimStatus(qrData.text);
    });

  }

  chkClaimStatus(url){
    let data: Observable<any>;    
    data = this.http.get(url);
      data.subscribe(result => {
        console.log(result);
        if (result[0].coupon_status ==="Invalid Coupon"){
          this.alertMsgFn(result[0].coupon_status,"Failure");
        }

        if (result[0].coupon_status_desc === "Valid") {
          // this.navCtrl.push('CoupondetailsPage', {
          //   "serialNo": "serialNo",
          //   "qrValue": "qrValue",
          //   "mode": "couponScan"
          // });
        }

       

      }, error => {   
          this.alertMsgFn("Invalid QR Code", "Failure");     
        console.log(error);
      });
  }


  alertMsgFn(msg,alertTitle) {
    let altsuccess = this.alertCtrl.create({
      title: alertTitle,
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.navCtrl.push(CreditListPage);
          }
        }
      ]
    });
    altsuccess.present();
  }

}
