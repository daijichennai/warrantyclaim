import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-invoicedetails',
  templateUrl: 'invoicedetails.html',
})
export class InvoicedetailsPage {
  public invoiceNo; 
  public invDetJson:any;
  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: HttpClient,
        private loadingCtrl: LoadingController,
        private myFunc: CommfuncProvider
    ) {
    this.invoiceNo = this.navParams.get('invoiceNo');
  }

  ionViewDidLoad() {
    this.getInvoiceDetByID(this.invoiceNo);
  }

  getInvoiceDetByID(invNo) {
    let data: Observable<any>;
    //alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/CustDetail.php?id=" + invNo;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.invDetJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();        
        console.log(error);
        //alert('Error in Invoice');
      });
    });
  }

}
