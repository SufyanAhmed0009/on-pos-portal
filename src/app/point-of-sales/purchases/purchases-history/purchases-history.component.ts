import { Component, OnInit } from '@angular/core';
import { RespPurchase, RespPurchaseItem, RespPurchaseList } from 'src/app/core/models/purchases';
import { DtPage } from 'src/app/core/models/page';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseDetailsComponent } from '../purchase-details/purchase-details.component';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqSheetUpload } from 'src/app/core/models/sheet-product';
import { UpdateInventoryComponent } from '../update-inventory/update-inventory.component';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-purchases-history',
  templateUrl: './purchases-history.component.html',
  styleUrls: ['./purchases-history.component.css']
})
export class PurchasesHistoryComponent implements OnInit {

  /* PURCHASES */
  purchases: RespPurchase[];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'whTitle',
    'deliveryOrderNo',
    'total',
    'approved',
    'download'
  ]

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* RIGHTS */
  userTypeList: number[];
  isAllowed: boolean = false;

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(
    private purchasesService: ServicePurchases,
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private spreadsheetService: ServiceSpreadsheet,
    private snackBarService: ServiceSnackbar,
    ) { }

  ngOnInit(): void {

    this.selectedStore = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.userTypeList = this.authService.getUserTypeList();
    this.isAllowed = this.userTypeList.includes(26);

    this.initPage();
    this.getPurchasesList();
    this.purchasesService.dataUpdated.subscribe(
      () => {
        this.getPurchasesList();
      }
    );

    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.selectedStore = store;
        this.getPurchasesList();
      }
    );

  }

  initPage() {
    this.page = {
      size: 10,
      page: 0,
    }
  }

  getPurchasesList() {
    this.loading = true;
    this.page.id = this.selectedStore.id;
    this.purchasesService.getPurchaseList(this.page).subscribe(
      (response: RespPurchaseList) => {
        console.log(response);
        this.count = response.count;
        this.purchases = response.transactionList;
        console.log("this.purchases")
        console.log(this.purchases)
        this.loading = false;
      }
    );
  }

  /* EVENT-HANDLER */
  onRefresh() {
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
  onSelectPurchase(purchase: RespPurchase) {
    if (purchase.isApproved) {
      this.showPurchaseDetails(purchase);
    } else {
      let request: ReqSheetUpload = {
        branchId: this.selectedStore.id,
        whId: 1,
        products: [],
        deliveryOrderNo: purchase.deliveryOrderno
      }
      if (this.isAllowed) {
        this.confirmUpload(purchase.id, request);
      } else {
        this.snackBarService.showErrorMessage("Permission denied!");
      }
    }
  }

  showPurchaseDetails(purchase: RespPurchase) {
    this.matDialog.open(PurchaseDetailsComponent, {
      width: '900px',
      data: purchase,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  confirmUpload(invoiceId: number, request: ReqSheetUpload) {
    this.matDialog.open(UpdateInventoryComponent, {
      width: '1500px',
      data: { id: invoiceId, invoice: request, isApproved: false },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh',
      maxWidth: '95vw',
    });
  }

  /* OTHER METHODS */
  getDate(timestamp: number) {
    let date = new Date(timestamp);
    date.setHours(date.getHours() - 5);
    // return new Date(timestamp);
    return date;
  }

  /* ON DOWMNLOAD */
  onDownload(purchase: RespPurchase) {
    console.log("purchase")
    console.log(purchase.id)
    this.loading = true;
    this.purchasesService.getPurchaseInfo(purchase.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log("download")
        console.log(response)
        this.loading = false;
        let purchaseDate = this.getDate(purchase.tsServer);
        let purchaseDateStr = this.datePipe.transform(purchaseDate, 'M-d-yy h-mm a');
        let fileName = purchase.id + ' - ' + purchaseDateStr;
        let data = response.map(
          (item) => {
            if (item.quantityApproved) {
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
            } else {
              return {
                'ID': item.id,
                'Title': item.title,
                'Warehouse Cost': item.whCost,
                'Quantity': item.quantity,
                'Cost': item.cost,
                'Pricing Strategy': item.pricingStrategyTitle,
                'Price': item.price
              }
            }
          }
        );
        this.spreadsheetService.exportAsExcelFile(data, fileName);
      }
    );
  }

  getDisplayedColumns() {
    if (this.isAllowed) {
      this.columnsList = [
        'id',
        'date',
        'whTitle',
        'deliveryOrderNo',
        'total',
        'approved',
        'download'
      ];
    } else {
      this.columnsList = [
        'id',
        'date',
        'whTitle',
        'deliveryOrderNo',
        'total',
        'approved',
      ];
    }
    return this.columnsList;
  }

}
