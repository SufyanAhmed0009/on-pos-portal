import { Component, OnInit, Inject } from '@angular/core';
import { RespPurchaseItem, RespPurchase } from 'src/app/core/models/purchases';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {

  purchaseItems: RespPurchaseItem[];

  /* COLUMNS LIST */
  columnsList = [
    'id',
    'title',
    'whCost',
    'quantity',
    'quantityApproved',
    'cost',
    'pricingStrategy',
    'price'
  ];

  /* LOADER */
  loading: boolean;

  constructor(
    private purchaseService: ServicePurchases,
    @Inject(MAT_DIALOG_DATA) public purchase: RespPurchase,
    private dialogRef: MatDialogRef<PurchaseDetailsComponent>,
    private spreadsheetService: ServiceSpreadsheet,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.getDetails();

  }

  getDetails() {
    this.loading = true;

    this.purchaseService.getPurchaseInfo(this.purchase.id).subscribe(
      (response: RespPurchaseItem[]) => {

        this.purchaseItems = response;
        this.loading = false;
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  getDate(timestamp: number) {
    return new Date(timestamp);
  }

  getTotalQuantity() {
    let sum = 0;
    this.purchaseItems.forEach(
      (item) => {
        sum += (item.quantity);
      }
    )
    return sum;
  }

  getTotalQuantityApproved() {
    let sum = 0;
    this.purchaseItems.forEach(
      (item) => {
        sum += (item.quantityApproved);
      }
    )
    return sum;
  }

  getTotalPrice() {
    let sum = 0;
    this.purchaseItems.forEach(
      (item) => {
        sum += (item.price);
      }
    )
    return sum;
  }

  getTotalWhCost() {
    let sum = 0;
    this.purchaseItems.forEach(
      (item) => {
        sum += (item.whCost);
      }
    )
    return sum;
  }

  onDownload() {
    let purchaseDate = this.getDate(this.purchase.tsServer);
    let purchaseDateStr = this.datePipe.transform(purchaseDate, 'M-d-yy h-mm a');
    let fileName = this.purchase.id + ' - ' + purchaseDateStr;
    let data = this.purchaseItems.map(
      (item) => {
        return {
          'Lib ID': item.libraryItemId,
          'ID': item.id,
          'Title': item.title,
          'Warehouse Cost': item.whCost,
          'Quantity': item.quantity,
          'Quantity Approved': item.quantityApproved,
          'Cost': item.cost,
          'Pricing Strategy': item.pricingStrategyTitle,
          'Price': item.price
        }
      }
    );
    this.spreadsheetService.exportAsExcelFile(data, fileName);
  }

}
