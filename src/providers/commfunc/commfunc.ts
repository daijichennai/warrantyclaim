import { Injectable } from '@angular/core';
@Injectable()
export class CommfuncProvider {

  public domainURL:string = "http://simpsonwms.arkaautomaations.com/";
  constructor() {
  }   

  getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

   convertINR(amt) {
     return amt.toLocaleString("en-IN", { currency: "INR" })
  }

}
