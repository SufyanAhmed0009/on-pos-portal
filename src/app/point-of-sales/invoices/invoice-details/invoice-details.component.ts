import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RespInvoice } from 'src/app/core/models/Invoices';
import { ServiceAuth } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  
  columnsList = [
    'number',
    'name',
    'quantity',
    'price',
    'totalPrice',
    'discount',
    'totalDiscount',
    'netPrice'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public invoice: RespInvoice,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {
    
  }

  getTotalPrice(){
    let totalPrice = 0;
    for (let item of this.invoice.listOfInvoiceItems){
      totalPrice += item.quantity * item.price;
    }
    return totalPrice;
  }

  getStoreName(){
    return this.authService.getBranchName();
  }

  /* FORMATTING METHODS */
  getSpaces(num: number) {
    let spaces = "";
    for (let i = 0; i < num; i++) {
      spaces += "&nbsp;";
    }
    return spaces;
  }
  getDottedLine() {
    return "------------------------------------------------";
  }
  getFivePlaceNumber(num: number) {
    let numStr = num + '';
    numStr += '.0';
    let numLength = numStr.length;
    for (let i = 0; i < 7 - numLength; i++) {
      numStr = "&nbsp" + numStr;
    }
    return numStr;
  }
  getTwentyFivePlaceName(name: string) {
    if (name.length <= 25) {
      let nameLength = name.length;
      for (let i = 0; i < 25 - nameLength; i++) {
        name += "&nbsp;";
      }
      return name;
    } else {
      let nameLength = name.length;
      let outStr = name.slice(0, 24) + "-<br>-" + name.slice(24);
      if (name.charAt(22) == ' ' || name.charAt(23) == ' '){
        outStr = name.slice(0, 24) + "<br>&nbsp;" + name.slice(24);
      }
      nameLength -= 23;
      for (let i = 0; i < 25 - nameLength; i++) {
        outStr += "&nbsp;";
      }
      return outStr;
    }
  }
  getTwoPlaceNumber(num: number){
    if (num < 10){
      return "&nbsp;"+num;
    } else {
      return num;
    }
  }

}
