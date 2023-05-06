import { Component, OnInit, Inject } from '@angular/core';
import { RespPurchaseItem, RespPurchase } from 'src/app/core/models/purchases';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceWarehouseCount } from 'src/app/core/services/warehouse-count.service';
import { BranchCountService } from 'src/app/core/services/branch-count.service';

@Component({
  selector: 'app-branch-count-details',
  templateUrl: './branch-count-details.component.html',
  styleUrls: ['./branch-count-details.component.css']
})
export class BranchCountDetailsComponent implements OnInit {

    countItems: RespPurchaseItem[];
  
    /* COLUMNS LIST */
    columnsList = [
      'id',
      'title',
      'quantity'
    ];
  
    /* LOADER */
    loading: boolean;
  
    constructor(
      private countService: BranchCountService,
      @Inject(MAT_DIALOG_DATA) public count: RespPurchase,
      private dialogRef: MatDialogRef<BranchCountDetailsComponent>,
      private datePipe: DatePipe,
      private spreadsheetService: ServiceSpreadsheet
    ) { }
  
    ngOnInit(): void {
  
      this.getDetails();
  
    }
  
    getDetails() {
      this.loading = true;
  
      this.countService.getCountInfo(this.count.id).subscribe(
        (response: RespPurchaseItem[]) => {
          console.log(response);
          this.countItems = response;
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
      this.countItems.forEach(
        (item) => {
          sum += (item.quantity);
        }
      )
      return sum;
    }
  
    onDownload() {
      let purchaseDate = this.getDate(this.count.tsServer);
      let purchaseDateStr = this.datePipe.transform(purchaseDate, 'M-d-yy h-mm a');
      let fileName = this.count.id + ' - ' + purchaseDateStr;
      let data = this.countItems.map(
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
  
  

}
