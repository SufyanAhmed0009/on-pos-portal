import { Component, OnInit } from '@angular/core';
import { RespPurchase, RespPurchaseList } from 'src/app/core/models/purchases';
import { DtPage } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WhPurchaseDetailsComponent } from '../purchase-details/purchase-details.component';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqSheetUpload, ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { WhUpdateInventoryComponent } from '../update-inventory/update-inventory.component';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ModalPurchaseFileAttachmentsComponent } from '../modal-purchase-file-attachments/modal-purchase-file-attachments.component';

@Component({
  selector: 'wh-purchases-history',
  templateUrl: './purchases-history.component.html',
  styleUrls: ['./purchases-history.component.css']
})
export class WhPurchasesHistoryComponent implements OnInit {

  /* PURCHASES */
  purchases: RespPurchase[];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'purchaseOrderNo',
    'supplierTitle',
    'total',
    'approved',
    'fileAttachments'
  ]

  /* SELECTED STORE */
  selectedStore: number;

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(
    private purchasesService: ServiceWarehousePurchases,
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
  ) { }

  ngOnInit(): void {

    this.selectedStore = this.authService.getBranchId();
    this.initPage();
    this.getPurchasesList();
    this.purchasesService.dataUpdated.subscribe(() => {
      this.getPurchasesList();
    });
 
  }

  initPage(){
    this.page = {
      id: this.selectedStore,
      size: 10,
      page: 0,
      isApproved: null
    }
  }

  getPurchasesList(){
    this.loading = true;
    this.purchasesService.getPurchaseList(this.page).subscribe(
      (response: RespPurchaseList) => {
        console.log(response);
        this.count = response.count;
        this.purchases = response.transactionList;
        this.loading = false;
      }
    );
  }

  /* EVENT-HANDLER */
  onRefresh(){
    this.getPurchasesList();
  }
  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getPurchasesList();
  }
  onFilterByDate(date: Date) {
    this.page.date = this.datePipe.transform(date, "yyyy-MM-dd");
    this.page.page = 0;
    this.getPurchasesList();
  }

  cancelFilterByDate() {
    this.page.page = 0;
    this.page.date = null;
    this.getPurchasesList();
  }
  onSelectPurchase(purchase: RespPurchase){
    if (purchase.isApproved){
      this.showPurchaseDetails(purchase);
    } else {
      let request: ReqWarehouseSheetUpload = {
        whId: this.selectedStore,
        products: [],
        purchaseOrderNo: purchase.purchaseOrderno,
        supplier: {
          id: purchase.supplierId
        }
      }
      this.confirmUpload(purchase.id, request);
    }
  }

  showPurchaseDetails(purchase: RespPurchase){
    this.matDialog.open(WhPurchaseDetailsComponent,{
      width: '800px',
      data: purchase,
      direction: <Direction> this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  confirmUpload(invoiceId: number, request: ReqWarehouseSheetUpload) {
    this.matDialog.open(WhUpdateInventoryComponent, {
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

  showFileAttachments(purchase: RespPurchase){
    this.matDialog.open(ModalPurchaseFileAttachmentsComponent,{
      width: '900px',
      data: purchase.id,
      direction: <Direction> this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

}
