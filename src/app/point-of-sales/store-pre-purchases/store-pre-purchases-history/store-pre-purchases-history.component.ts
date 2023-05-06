import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DtPage } from 'src/app/core/models/page';
import { BranchPrepurchaseListResponse, RespPurchase, RespPurchaseList,BranchPrepurchaseResponse } from 'src/app/core/models/purchases';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceStorePrePurchase } from 'src/app/core/services/store-pre-purchase.service';
import { StorePrePurchasesDetailsComponent } from '../store-pre-purchases-details/store-pre-purchases-details.component';

@Component({
  selector: 'app-store-pre-purchases-history',
  templateUrl: './store-pre-purchases-history.component.html',
  styleUrls: ['./store-pre-purchases-history.component.css']
})
export class StorePrePurchasesHistoryComponent implements OnInit {

  /* PURCHASES */
  purchases: BranchPrepurchaseResponse[] = [];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'purchaseOrderNo',
    'prePurchaseApproved',
    'approved'
  ]

  /* SELECTED STORE */
  selectedStore: number;

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(
    private prePurchaseService: ServiceStorePrePurchase,
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
  ) { }

  ngOnInit(): void {

    this.selectedStore = this.authService.getBranchId();
    this.initPage();
    this.getPurchasesList();
    this.prePurchaseService.dataUpdated.subscribe(() => {
      this.getPurchasesList();
    });

  }

  initPage() {
    this.page = {
      branchId: this.selectedStore,
      size: 10,
      page: 0,
    }
  }

  getPurchasesList() {
    this.loading = true;
    console.log("this.page")
    console.log(this.page)
    console.log(JSON.stringify(this.page))
    this.prePurchaseService.getPurchaseList(this.page).subscribe(
      (response: BranchPrepurchaseListResponse) => {
        console.log("response");
        console.log(response);
        this.count = response.count;
        this.purchases = response.branchPrePurchaseTransaction;
        this.loading = false;
      }
    );
  }

  stateChanged(id, event) {
    this.prePurchaseService.onOpen(id, event.checked ? 1 : 0).subscribe(
      (response) => {
        this.getPurchasesList();
      });
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
    this.showPurchaseDetails(purchase);
  }

  showPurchaseDetails(purchase: RespPurchase) {
    this.matDialog.open(StorePrePurchasesDetailsComponent, {
      width: '800px',
      data: purchase,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* OTHER METHODS */
  getDate(timestamp: number) {
    return new Date(timestamp);
  }
}
