import { Component, OnInit, Inject } from '@angular/core';
import { RespPurchaseItem, RespPurchase } from 'src/app/core/models/purchases';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { DatePipe } from '@angular/common';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';

@Component({
  selector: 'wh-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class WhPurchaseDetailsComponent implements OnInit {

  purchaseItems: RespPurchaseItem[];

  /* COLUMNS LIST */
  columnsList = [
    'id',
    'title',
    'quantity',
    'cost',
    'pricingStrategy',
    'price'
  ];

  /* LOADER */
  loading: boolean;

  constructor(
    private purchaseService: ServiceWarehousePurchases,
    @Inject(MAT_DIALOG_DATA) public purchase: RespPurchase,
    private dialogRef: MatDialogRef<WhPurchaseDetailsComponent>,
    private datePipe: DatePipe,
    private spreadsheetService: ServiceSpreadsheet
  ) { }

  ngOnInit(): void {

    this.getDetails();

  }

  getDetails() {
    this.loading = true;

    this.purchaseService.getPurchaseInfo(this.purchase.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log(response);
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

  getTotalPrice() {
    let sum = 0;
    this.purchaseItems.forEach(
      (item) => {
        sum += (item.price);
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
          'Quantity': item.quantity,
          'cost': item.cost,
          'Pricing Strategy': item.pricingStrategyTitle,
          'Price': item.price
        }
      }
    );
    this.spreadsheetService.exportAsExcelFile(data, fileName);
  }

}
