import { Component, OnInit } from '@angular/core';
import { RespCountList, RespPurchase } from 'src/app/core/models/purchases';
import { DtPage } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WhCountDetailsComponent } from '../count-details/count-details.component';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { WhUpdateCountComponent } from '../update-count/update-count.component';
import { ServiceWarehouseCount } from 'src/app/core/services/warehouse-count.service';

@Component({
  selector: 'wh-count-history',
  templateUrl: './count-history.component.html',
  styleUrls: ['./count-history.component.css']
})
export class WhCountHistoryComponent implements OnInit {

  /* PURCHASES */
  counts: RespPurchase[];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'countNumber',
    'approved'
  ]

  /* SELECTED STORE */
  selectedStore: number;

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(
    private countService: ServiceWarehouseCount,
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
  ) { }

  ngOnInit(): void {

    this.selectedStore = this.authService.getBranchId();
    this.initPage();
    this.getCountList();
    this.countService.dataUpdated.subscribe(() => {
      this.getCountList();
    });

  }

  initPage() {
    this.page = {
      whId: this.selectedStore,
      size: 10,
      page: 0
    }
  }

  getCountList() {
    this.loading = true;
    this.countService.geCountList(this.page).subscribe(
      (response: RespCountList) => {
        console.log(response);
        this.count = response.count;
        this.counts = response.whCountTransaction;
        this.loading = false;
      }
    );
  }

  stateChanged(id, event) {
    this.countService.onOpen(id, event.checked ? 1 : 0).subscribe(
      (response) => {

      });
  }


  /* EVENT-HANDLER */
  onRefresh() {
    this.getCountList();
  }

  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getCountList();
  }

  onFilterByDate(date: Date) {
    this.page.date = this.datePipe.transform(date, "yyyy-MM-dd");
    this.page.page = 0;
    this.getCountList();
  }

  cancelFilterByDate() {
    this.page.page = 0;
    this.page.date = null;
    this.getCountList();
  }

  onSelectCount(count: RespPurchase) {
    if (count.isApproved) {
      this.showCountDetails(count);
    } else {
      let request: ReqWarehouseSheetUpload = {
        whId: this.selectedStore,
        products: [],
        countNumber: count.countNumber,
      }
      this.confirmUpload(count.id, request);
    }
  }

  showCountDetails(purchase: RespPurchase) {
    this.matDialog.open(WhCountDetailsComponent, {
      width: '800px',
      data: purchase,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  confirmUpload(countId: number, request: ReqWarehouseSheetUpload) {
    this.matDialog.open(WhUpdateCountComponent, {
      width: '800px',
      data: { id: countId, count: request, isApproved: false },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

  /* OTHER METHODS */
  getDate(timestamp: number) {
    return new Date(timestamp);
  }

}
