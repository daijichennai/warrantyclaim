import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-changepwd',
  templateUrl: 'changepwd.html',
})
export class ChangepwdPage {
  authForm: FormGroup;
  public type = 'password';
  public showPass = false;
  public currentPassword:string;
  public newPassword: string;
  public confirmPassword: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
  ) {

    this.authForm = fb.group({
      'currentPWD': ['', Validators.compose([Validators.required])],
      'newPWD': ['null', Validators.compose([Validators.required])],
      'confirmPWD': ['', Validators.compose([Validators.required, this.equalto('newPWD')])],
    })  
  }

  ionViewDidLoad() {
  }

  changePwdFn(){
    
  }

  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;

      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }
}
