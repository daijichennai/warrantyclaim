import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-coupondetails',
  templateUrl: 'coupondetails.html',
})
export class CoupondetailsPage {
  public serialNo;
  public mode;
  public qrValue;
  public couponDetailsJson: any;
  public isAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider
  ) {
    this.serialNo = this.navParams.get('serialNo');
    this.mode = this.navParams.get('mode');
    this.qrValue = this.navParams.get('qrValue');
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

  ionViewDidLoad() {
    this.getCouponDetailsBySerialNo(this.serialNo);
  }

  getCouponDetailsBySerialNo(serialNo){
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/coupon_detail_api.php?serial_no=" + serialNo;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        if (result.length != 0) {
          this.isAvailable = false;
          this.couponDetailsJson = result;
        } else {
          this.isAvailable = true;
        }
        loader.dismiss();
      }, error => {
        this.isAvailable = true;
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }


  createClaim(){
    let data: Observable<any>;
    let url = this.myFunc.domainURL + 'WarrantyAppAPI/coupon_claim_update.php';
    var queryParams = JSON.stringify({ qr_value: this.qrValue});
    let loader = this.loadingCtrl.create({
      content: 'Creating Claim'
    });
    data = this.http.post(url, queryParams);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        loader.dismiss();
      }, error => {
        console.log(error);
        alert(error.message);
        loader.dismiss();
      });
    });
  }

}
