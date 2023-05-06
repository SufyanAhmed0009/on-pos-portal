import { Component, OnInit } from '@angular/core';
import { RespPurchase, RespPurchaseList } from 'src/app/core/models/purchases';
import { DtPage } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqSheetUpload, ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { RespInvoice, RespInvoiceList } from 'src/app/core/models/invoice';
import { ServiceWarehouseInvoice } from 'src/app/core/services/warehouse-invoice.service';
import { UpdateInvoiceComponent } from '../update-invoice/update-invoice.component';

@Component({
  selector: 'wh-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {

  selectedWarehouse: number;

  /* PURCHASES */
  invoices: RespInvoice[];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'invoiceNo',
    'customerTitle',
    'total',
    'approved'
  ]

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(
    private invoiceService: ServiceWarehouseInvoice,
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
  ) { }

  ngOnInit(): void {
    this.selectedWarehouse = this.authService.getBranchId();
    this.initPage();
    this.getInvoiceList();
    this.invoiceService.dataUpdated.subscribe(() => {
      this.getInvoiceList();
    });
 
  }

  initPage(){
    this.page = {
      id: this.selectedWarehouse,
      size: 10,
      page: 0,
      isApproved: null
    }
  }

  getInvoiceList(){
    this.loading = true;
    this.invoiceService.getInvoiceList(this.page).subscribe(
      (response: RespInvoiceList) => {
        console.log(response);
        this.count = response.count;
        this.invoices = response.transactionList;
        this.loading = false;
      }
    );
  }

  /* EVENT-HANDLER */
  onRefresh(){
    this.getInvoiceList();
  }

  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getInvoiceList();
  }

  onFilterByDate(date: Date) {
    this.page.date = this.datePipe.transform(date, "yyyy-MM-dd");
    this.page.page = 0;
    this.getInvoiceList();
  }

  cancelFilterByDate() {
    this.page.page = 0;
    this.page.date = null;
    this.getInvoiceList();
  }

  onSelectInvoice(invoice: RespInvoice){
    if (invoice.isApproved){
      this.showInvoiceDetails(invoice);
    } else {
      let request: ReqWarehouseSheetUpload = {
        whId: this.selectedWarehouse,
        products: [],
        invoiceNo: invoice.invoiceNo,
        customer: {
          id: invoice.customerId
        }
      }
      this.confirmUpload(invoice.id, request);
    }
  }

  showInvoiceDetails(purchase: RespInvoice){
    this.matDialog.open(InvoiceDetailsComponent,{
      width: '800px',
      data: purchase,
      direction: <Direction> this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  confirmUpload(invoiceId: number, request: ReqWarehouseSheetUpload) {
    this.matDialog.open(UpdateInvoiceComponent, {
      width: '800px',
      data: { id: invoiceId, invoice: request, isApproved: false },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

  /* OTHER METHODS */
  getDate(timestamp: number){
    return new Date(timestamp);
  }

}
