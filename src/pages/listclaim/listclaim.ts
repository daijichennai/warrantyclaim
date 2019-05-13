import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
@IonicPage()
@Component({
  selector: 'page-listclaim',
  templateUrl: 'listclaim.html',
})
export class ListclaimPage {
  public claimJson: any;
  public isClaimAvailable: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider
  ) {

  }

  ionViewDidLoad() {
    this.storage.get('lsCustCode').then((custCode) => {
      this.getListClaimByCustCode(custCode);
    });    
  }

  goToClaimDetails(claimID){
    this.navCtrl.push('ClaimdetailsPage',{
      "claimID": claimID
    });
  }

  getListClaimByCustCode(custCode) {
    let data: Observable<any>;
    //alert(custCode);
    let url = this.myFunc.domainURL + "WarrantyAppAPI/RequestClaim.php?MasData=" + custCode;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.isClaimAvailable = false;
        this.claimJson = result;
        loader.dismiss();
      }, error => {
          this.isClaimAvailable = true;
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }

  searchitem(searchbar) {
    console.log(searchbar);
    var val = searchbar.target.value;
    if (val && val.trim() != '') {
      this.claimJson = this.claimJson.filter((item) => {
        return item.invoice_no.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.claim_status.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

}
