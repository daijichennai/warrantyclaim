import { Injectable } from '@angular/core';

@Injectable()
export class CommfuncProvider {

  public domainURL:string = "http://simpsonwms.arkaautomaations.com/";
  constructor() {
  }

   convertINR(amt) {
    //return amt.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,')
     return amt.toLocaleString("en-IN", { currency: "INR" })
  }

}
