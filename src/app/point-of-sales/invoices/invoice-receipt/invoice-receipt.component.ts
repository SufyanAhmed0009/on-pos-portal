import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DtInvoiceProduct, ReqInvoice } from 'src/app/core/models/Invoices';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceSyncProducts } from 'src/app/core/services/sync-products.service';
import { ServiceInvoice } from 'src/app/core/services/invoice.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSyncInvoices } from 'src/app/core/services/sync-invoices.service';

@Component({
  selector: 'app-invoice-receipt',
  templateUrl: './invoice-receipt.component.html',
  styleUrls: ['./invoice-receipt.component.css']
})
export class InvoiceReceiptComponent implements OnInit {

  //Bill Data.
  paidAmount: number = 0;
  paymentForm: FormGroup;

  //Getting Data from Parent Object.
  invoiceProducts: DtInvoiceProduct[];
  invoiceDetails: ReqInvoice;

  // Store Name
  storeName: string;

  constructor(
    public dialogRef: MatDialogRef<InvoiceReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DtInvoiceData,
    private syncProductsService: ServiceSyncProducts,
    private syncInvoicesService: ServiceSyncInvoices,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {
    this.invoiceProducts = this.data.invoiceProducts;
    this.invoiceDetails = this.data.invoiceDetails;
    this.invoiceDetails.invoice.billDiscount = 0;
    this.storeName = this.authService.getBranchName();

    this.paymentForm = new FormGroup({
      'paidAmount': new FormControl(null, [Validators.required, Validators.min(this.invoiceDetails.invoice.netAmount)]),
    });
  }

  getReturnAmount() {
    let amountPaid = this.paymentForm.controls.paidAmount.value;
    let discount = this.invoiceDetails.invoice.billDiscount;
    if (amountPaid > this.invoiceDetails.invoice.netAmount - discount) {
      return amountPaid - this.invoiceDetails.invoice.netAmount + discount;
    } else {
      return 0;
    }
  }

  getPaymentAmount() {
    if (this.paymentForm.controls.paidAmount == null) {
      return 0;
    } else {
      return this.paymentForm.controls.paidAmount.value;
    }
  }

  isPaymentValid() {
    let paidAmount = this.paymentForm.controls.paidAmount.value;
    let netAmount = this.invoiceDetails.invoice.netAmount;
    return paidAmount >= netAmount;
  }

  onPayment() {
    this.invoiceDetails.invoice.paidAmount = this.paymentForm.controls.paidAmount.value;
    this.invoiceDetails.invoice.amountReturned = this.getReturnAmount();
  }

  onSave() {
    this.invoiceDetails.invoice.paidAmount = this.paymentForm.controls.paidAmount.value;
    this.invoiceDetails.invoice.amountReturned = this.getReturnAmount();
    this.syncInvoicesService.addToInvoiceSyncList(this.invoiceDetails);
    // this.invoiceDetails.productsList.forEach(
    //   (item) => {
    //     this.syncInvoicesService.updateQuantityById(item.id, item.quantity);
    //   }
    // );
    this.syncInvoicesService.invoiceAdded.emit();
    this.dialogRef.close();
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
    return "---------------------------------------------";
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
      if (name.charAt(22) == ' ' || name.charAt(23) == ' ') {
        outStr = name.slice(0, 24) + "<br>&nbsp;" + name.slice(24);
      }
      nameLength -= 23;
      for (let i = 0; i < 25 - nameLength; i++) {
        outStr += "&nbsp;";
      }
      return outStr;
    }
  }
  getTwoPlaceNumber(num: number) {
    if (num < 10) {
      return "&nbsp;" + num;
    } else {
      return num;
    }
  }

}

class DtInvoiceData {
  invoiceProducts: DtInvoiceProduct[];
  invoiceDetails: ReqInvoice;
}