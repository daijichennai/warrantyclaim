import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})
export class QrcodePage {
  public CompanyName: any;
  public InvoiceDate: any;
  public InvoiceNo: any;
  public MaterialCode: any;
  public MaterialName: any;
  public Address: any;
  public Quantity: any;
  public warrenty: any;
  public Remarks: any;
  public splitted: any;
  public scanData: any;
  public UserId: any;
  public date: string = new Date().toLocaleString();
  public warentyRequest: any;
  public TotSum: any;
  public QrInv: any;
  public ScanMat: any;
  public QRImage: boolean;
  public ShowForm: boolean;
  public Expire: boolean;
  public Waiting: boolean;
  credentialsForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public barcodeScanner: BarcodeScanner,
    private myFunc: CommfuncProvider,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public platfrm: Platform,
    public alertCtrl: AlertController,
    public sqlite: SQLite,
    public storage: Storage,
    public formBuilder: FormBuilder,
  ) {
    this.QRImage = true;
    this.ShowForm = false;
    if (this.navCtrl.last().name == 'ReviewPage' || this.navCtrl.last().name == 'UnmatchinvoicePage' || this.navCtrl.last().name == 'ItemexistPage') {
      this.BarScan();
    }
    this.storage.get('lsUserID').then((val) => {
      if (val != '') {
        this.UserId = val;
      }
    });
    if (this.TotSum == undefined) {
      this.TotSum = 0;
    }
    this.credentialsForm = this.formBuilder.group({
      CompanyName: [''],
      Address: [''],
      InvoiceNo: [''],
      InvoiceDate: [''],
      UserId: [''],
      MaterialCode: [''],
      MaterialName: [''],
      Quantity: [''],
      warrenty: [''],
      Remarks: ['']
    });
  }
  ionViewDidLoad() {
    this.QRImage = true;
    this.ShowForm = false;
    this.getData(); 
    this.date = this.myFunc.getDate();
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT COUNT(rowid) AS TotSum,InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        alert(JSON.stringify(res));
        this.TotSum = res.rows.item(0).TotSum;
        this.QrInv = res.rows.item(0).InvoiceNo;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  // ionViewWillEnter() {
  //   this.QRImage = true;
  //   this.ShowForm = false;
  //   this.getData(); 
  //   this.date = this.myFunc.getDate();
  //   this.sqlite.create({
  //     name: 'ionicdb.db',
  //     location: 'default'
  //   }).then((db: SQLiteObject) => {
  //     db.executeSql('SELECT COUNT(rowid) AS TotSum,InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
  //       this.TotSum = res.rows.item(0).TotSum;
  //       this.QrInv = res.rows.item(0).InvoiceNo;
  //     }).catch(e => console.log(e));
  //   }).catch(e => console.log(e));
  // }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS WarrentyRequest(rowid INTEGER PRIMARY KEY, timestamp Text, CompanyName TEXT, Address TEXT, InvoiceNo TEXT,InvoiceDate TEXT, UserId TEXT, MaterialCode TEXT ,MaterialName TEXT , warrenty TEXT, Quantity TEXT , Remarks TEXT)', []).then(res => console.log('Executed SQL')).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
  saveData() {
    if (this.MaterialCode == undefined) {
      this.alertMsgFn('Material Code Should Not Be Empty..!');
      return false;
    }
    if (this.warrenty == undefined || this.warrenty == 0) {
      this.alertMsgFn('Warranty Type Should Not Be Empty..!');
      return false;
    }
    if (this.Quantity == undefined) {
      this.alertMsgFn('Quantity Should Not Be Empty..!');
      return false;
    }
    if (this.Remarks == undefined || this.warrenty == 0) {
      this.alertMsgFn('Remarks Should Not Be Empty..!');
      return false;
    }

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO WarrentyRequest VALUES(NULL,?,?,?,?,?,?,?,?,?,?,?)', [this.date, this.CompanyName, this.Address, this.InvoiceNo, this.InvoiceDate, this.UserId, this.MaterialCode, this.MaterialName, this.warrenty, this.Quantity, this.Remarks])
        .then(res => {
          this.credentialsForm.reset();
          this.scanData = '';
          this.Review('1');
        }).catch(e => { console.log(e); });
    }).catch(e => {
      console.log(e);
    });
  }
  // deleteData(rowid) {
  //   this.sqlite.create({
  //     name: 'ionicdb.db',
  //     location: 'default'
  //   }).then((db: SQLiteObject) => {
  //     db.executeSql('DELETE FROM WarrentyRequest WHERE rowid=?', [rowid])
  //       .then(res => {
  //         console.log(res);
  //         this.getData();
  //       })
  //       .catch(e => console.log(e));
  //   }).catch(e => console.log(e));
  // }

  BarScan() {
    localStorage.removeItem('audiolist');
    let options = {
      resultDisplayDuration: 0,
      showTorchButton: true,
      showFlipCameraButton: true,
      prompt: "Scanning your QR Code"
    };

    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scanData = barcodeData.text;
      this.splitted = this.scanData.split("&@");
      if (this.splitted[1] != undefined) {
        this.QRImage = false;
        this.Expire = false;
        this.Waiting = false;
        this.ShowForm = true;
      }
      else {
        this.ShowForm = false;
      }
      let data: Observable<any>;
      data = this.http.get(this.myFunc.domainURL + 'WarrantyAppAPI/GetQRDetails.php?InvoiceNo=' + this.splitted[1] + '&MaterialCode=' + this.splitted[2]);
      data.subscribe(result => {
        alert(JSON.stringify(result));
        if (JSON.stringify(result) === null) {
          this.QRImage = true;
          this.Expire = false;
          this.Waiting = false;
          this.ShowForm = false;
          this.alertMsgFn('No Data Found..!'); 
        }
        if (result.length === 0) {
          this.ShowForm = false;
          this.alertMsgFn('No Data Found..!');
        }

        if (result[0].ref_no == undefined) {
          this.ScanMat = result[0].part_no;
          this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('SELECT COUNT(rowid) AS TotMat FROM WarrentyRequest WHERE MaterialCode=?', [this.ScanMat]).then(res => {
              if (res.rows.item(0).TotMat === 0) {
                if (this.QrInv != null) {
                  if (this.QrInv != result[0].invoice_no) {
                    this.navCtrl.push('UnmatchinvoicePage');
                    this.QRImage = true;
                    this.Expire = false;
                    this.Waiting = false;
                    this.ShowForm = false;
                  }
                }
                if (this.QrInv === null || this.QrInv === result[0].invoice_no) {
                  this.QRImage = false;                            
                  let CurDate :any  = new Date(this.date);
                  let invDate: any = new Date(result[0].invoice_date);
                  let resDate: any = (CurDate - invDate) / (24 * 3600 * 1000);
                  alert('CurDate = ' + CurDate);
                  alert('resDate = ' + resDate);
                  if (parseInt(resDate) < 15) {
                    this.QRImage = false;
                    this.Expire = false;
                    this.Waiting = false;
                    this.InvoiceNo = result[0].invoice_no;
                    this.InvoiceDate = result[0].invoice_date;
                    this.MaterialCode = result[0].part_no;
                    this.MaterialName = result[0].part_description;
                    this.CompanyName = result[0].customer_name;
                    this.Address = result[0].shipped_to;
                  }
                  else {
                    this.QRImage = false;
                    this.Expire = true;
                    this.ShowForm = false;
                    this.Waiting = false;
                    if (this.Quantity == undefined) {
                      this.alertMsgFn('Warranty Claim  Expires for this Material..!');
                    }
                  }
                }
              }
              else {
                this.navCtrl.push('ItemexistPage',{
                    Lclr: '0'
                });
              }
            }).catch(e => console.log(e));
          }).catch(e => console.log(e));
        }
        else {
          this.navCtrl.push('ItemexistPage', {
             Lclr: '1'
          });
        }
      }, (error) => {
        this.QRImage = false;
        this.Expire = false;
        this.Waiting = true;
        this.ShowForm = false;
        //alert(JSON.stringify(error));
      });

    }).catch(err => {
      console.log('Error', err);
    });

  }

  alertMsgFn(msg:string){
    let altsuccess = this.alertCtrl.create({
      title: 'Alert',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });
    altsuccess.present();
  }

  Review(RevValue) {
    if (RevValue != 0) {
      this.navCtrl.push('ReviewPage');
    }
    else {
      this.alertMsgFn('No Record To Review..!'); 
    }
  }




}
