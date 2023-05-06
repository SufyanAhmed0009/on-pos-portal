import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RespPurchase, RespPurchaseItem } from 'src/app/core/models/purchases';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceWarehousePrePurchase } from 'src/app/core/services/warehouse-pre-purchase.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';

@Component({
  selector: 'wh-pre-purchase-details',
  templateUrl: './pre-purchase-details.component.html',
  styleUrls: ['./pre-purchase-details.component.css']
})
export class WhPrePurchaseDetailsComponent implements OnInit {

  purchaseItems: RespPurchaseItem[];
  submitting: boolean = false;

  /* COLUMNS LIST */
  columnsList = [
    'id',
    'title',
    'quantity',
  ];

  /* LOADER */
  loading: boolean;

  constructor(
    private prePurchaseService: ServiceWarehousePrePurchase,
    @Inject(MAT_DIALOG_DATA) public purchase: RespPurchase,
    private dialogRef: MatDialogRef<WhPrePurchaseDetailsComponent>,
    private datePipe: DatePipe,
    private spreadsheetService: ServiceSpreadsheet
  ) { }

  ngOnInit(): void {

    this.getDetails();

  }

  getDetails() {
    this.loading = true;

    this.prePurchaseService.getPurchaseInfo(this.purchase.id).subscribe(
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

  onDownload() {
    let purchaseDate = this.getDate(this.purchase.tsServer);
    let purchaseDateStr = this.datePipe.transform(purchaseDate, 'M-d-yy h-mm a');
    let fileName = this.purchase.id + ' - ' + purchaseDateStr;
    let data = this.purchaseItems.map(
      (item) => {
        return {
          'ID': item.id,
          'Title': item.title,
          'Quantity': item.quantity,
        }
      }
    );
    this.spreadsheetService.exportAsExcelFile(data, fileName);
  }

  onApprove(){
    console.log("Approved")
    this.submitting =true;
    this.prePurchaseService.onApprove(this.purchase.id, 1).subscribe(
      (response)=>{
        console.log("response")
        console.log(response)
        this.prePurchaseService.dataUpdated.emit();
        this.dialogRef.close();
      }
    )
  }
}
