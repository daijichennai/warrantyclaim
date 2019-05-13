import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  authForm: FormGroup;
  public userPassword: string;
  public userName: string;
  public fullUserName: string;
  public custCode: string;
  public type = 'password';
  public showPass = false;
  constructor(
            public navCtrl: NavController,
            public navParams: NavParams,
            public fb: FormBuilder,
            )
    {
      this.authForm = fb.group({
        'chkFullUserName': [null, Validators.compose([Validators.required])],
        'chkCustCode': [null, Validators.compose([Validators.required])],
        'chkUserName': [null, Validators.compose([Validators.required])],
        'chkUserPassword': [null, Validators.compose([Validators.required])]
      });

  }

  ionViewDidLoad() {
    
  }

  registerFn(){

  }

  goToLogin() {
    this.navCtrl.push('LoginPage');
  }

  showPassword() {
    this.showPass = !this.showPass; 
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
