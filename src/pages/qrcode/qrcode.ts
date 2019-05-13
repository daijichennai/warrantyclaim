import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  options: BarcodeScannerOptions;
  encodText:String='';
  encodData:any={};
  scannedData:any={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private scanner: BarcodeScanner
    // private qrScanner: QRScanner
  ) {
  }

  ionViewDidLoad() {
  }

  scanQRCode() {
    this.options = {
      prompt:'Scan Your Bar Code'
    };
    this.scanner.scan(this.options).then((response) =>{
      this.scannedData = response;
     },error =>{
       console.log(error);
     });
  }

  encode(){
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodText).then((result) => {
      this.encodData = result;
    }, error => {
      console.log(error);
    });
  }

}
