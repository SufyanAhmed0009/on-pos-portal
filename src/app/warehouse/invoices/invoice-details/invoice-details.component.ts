import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceWarehouseInvoice } from 'src/app/core/services/warehouse-invoice.service';
import { RespInvoice, RespInvoiceItem } from 'src/app/core/models/invoice';

@Component({
  selector: 'wh-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {

  invoiceItems: RespInvoiceItem[];

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
    private invoiceService: ServiceWarehouseInvoice,
    @Inject(MAT_DIALOG_DATA) public invoice: RespInvoice,
    private dialogRef: MatDialogRef<InvoiceDetailsComponent>,
    private datePipe: DatePipe,
    private spreadsheetService: ServiceSpreadsheet
  ) { }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    this.loading = true;

    this.invoiceService.getInvoiceInfo(this.invoice.id).subscribe(
      (response: RespInvoiceItem[]) => {
        console.log(response);
        this.invoiceItems = response;
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
    this.invoiceItems.forEach(
      (item) => {
        sum += (item.quantity);
      }
    )
    return sum;
  }

  getTotalPrice() {
    let sum = 0;
    this.invoiceItems.forEach(
      (item) => {
        sum += (item.price);
      }
    )
    return sum;
  }

  onDownload() {
    let purchaseDate = this.getDate(this.invoice.tsServer);
    let purchaseDateStr = this.datePipe.transform(purchaseDate, 'M-d-yy h-mm a');
    let fileName = this.invoice.id + ' - ' + purchaseDateStr;
    let data = this.invoiceItems.map(
      (item) => {
        return {
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
