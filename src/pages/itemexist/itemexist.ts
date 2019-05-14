import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
@IonicPage()
@Component({
  selector: 'page-itemexist',
  templateUrl: 'itemexist.html',
})
export class ItemexistPage {
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
  public myData; any;
  public scanData: any;
  public AudioDuriation: any;
  public EnableBack: any;
  public user_id: any;
  public UserId: any;
  public typee: any;
  public Id: any;
  public date: string = new Date().toLocaleString();
  public CurDate: any;
  public CurDate1: any;
  public resDate: any;
  public warentyRequest: any;
  public TotSum: any;
  public AddMore: any;
  public QrInv: any;
  public QRImage: boolean;
  public ShowForm: boolean;
  public Expire: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public sqlite: SQLite
  ) {
    this.Id = this.navParams.get('Lclr');
    this.storage.get('lsUserID').then((val) => {
      if (val != '') {
        this.UserId = val;
      }
    });
    if (this.TotSum == undefined) {
      this.TotSum = 0;
    }
  }

  ionViewDidLoad() {
    this.QRImage = true;
    this.ShowForm = false;
    this.getData();
    var date_to_parse = new Date();
    var year = date_to_parse.getFullYear().toString();
    var month = (date_to_parse.getMonth() + 1).toLocaleString();
    var day = date_to_parse.getDate().toLocaleString();
    var hour = date_to_parse.getHours().toLocaleString();
    var minute = (date_to_parse.getMinutes() + 1).toLocaleString();
    var sec = date_to_parse.getSeconds().toLocaleString();

    this.date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT COUNT(rowid) AS TotSum FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.TotSum = res.rows.item(0).TotSum;

      }).catch(e => console.log(e));
      db.executeSql('SELECT InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.QrInv = res.rows.item(0).InvoiceNo;

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  ionViewWillEnter() {
    this.QRImage = true;
    this.ShowForm = false;
    this.getData();
    var date_to_parse = new Date();
    var year = date_to_parse.getFullYear().toString();
    var month = (date_to_parse.getMonth() + 1).toLocaleString();
    var day = date_to_parse.getDate().toLocaleString();
    var hour = date_to_parse.getHours().toLocaleString();
    var minute = (date_to_parse.getMinutes() + 1).toLocaleString();
    var sec = date_to_parse.getSeconds().toLocaleString();

    this.date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + sec;

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT COUNT(rowid) AS TotSum,InvoiceNo FROM WarrentyRequest ORDER BY rowid DESC', []).then(res => {
        this.TotSum = res.rows.item(0).TotSum;
        this.QrInv = res.rows.item(0).InvoiceNo;
      }).catch(e => console.log(e));

    }).catch(e => console.log(e));
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS WarrentyRequest(rowid INTEGER PRIMARY KEY, timestamp Text, CompanyName TEXT, Address TEXT, InvoiceNo TEXT,InvoiceDate TEXT, UserId TEXT, MaterialCode TEXT ,MaterialName TEXT , warrenty TEXT, Quantity TEXT , Remarks TEXT)', []).then(res => console.log('Executed SQL')).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  Review(RevValue) {
    if (RevValue != 0) {
      this.navCtrl.push('ReviewPage');
    }
    else {
      let altsuccess = this.alertCtrl.create({
        title: 'Alert',
        message: 'No Records To Review..!',
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
  }

  PageChange() {
    this.navCtrl.push('QrcodePage').then(() => {
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
  }

}
