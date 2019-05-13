import { Injectable } from '@angular/core';
@Injectable()
export class CommfuncProvider {

  public domainURL:string = "http://simpsonwms.arkaautomaations.com/";
  constructor() {
  }   

   convertINR(amt) {
     return amt.toLocaleString("en-IN", { currency: "INR" })
  }

}
