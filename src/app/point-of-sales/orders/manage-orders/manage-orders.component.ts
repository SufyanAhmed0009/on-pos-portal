import { Component, OnInit, OnDestroy } from '@angular/core';
import { DtOrdersPage } from 'src/app/core/models/page';
import { DtStatus } from 'src/app/core/models/status';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { RespOrdersList, RespOrder, DtOrdersStatusCount, RespOrdersStatus } from 'src/app/core/models/orders';
import { Subscription, interval } from 'rxjs';
import { DtDateRange } from 'src/app/core/models/date';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { DtSelectItem } from 'src/app/core/models/select';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit, OnDestroy {

  orders: RespOrder[];
  loading: boolean;
  page: DtOrdersPage;
  error: string;
  count: number;
  lastFetched: Date;
  lastFetchedCount: number;
  autoFetch: Subscription;

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* STATUS LIST */
  statusCountList: DtOrdersStatusCount[];
  statusCountListTwo: DtOrdersStatusCount[];

  constructor(
    private authService: ServiceAuth,
    private ordersService: ServiceOrders,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {

    this.selectedStore = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.initStatus();
    this.initPage();
    this.getOrdersList();

    // Auto - Re-fetch.
    this.lastFetchedCount = 0;
    this.autoFetch = interval(10000).subscribe(
      () => {
        this.lastFetchedCount += 10;
        if (this.lastFetchedCount >= 60 && !this.loading) {
          this.getOrdersList();
        }
      }
    );

    // DATA UPDATED
    this.ordersService.dateUpdated.subscribe(
      () => {
        this.getOrdersList();
      }
    );

    // STORE SELECTED 
    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.onStoreSelected(store);
      }
    )

  }

  initStatus() {
    this.statusCountList = []
    this.statusCountListTwo = [];
  }

  initPage() {
    this.page = {
      size: 10,
      page: 0,
      id: null,
      statusId: null,
      start: "",
      end: "",
      userId: null,
      hqId: null,
      orderBy: "",
      branchId: this.authService.getBranchId()
    };
  }

  getOrdersList() {
    this.loading = true;
    this.getHighlights();
    this.ordersService.getBranchOrdersList({ ...this.page }).subscribe(
      (response: RespOrdersList) => {
        this.setListOfOrders(response);
        this.loading = false;
        this.lastFetched = new Date();
        this.lastFetchedCount = 0;
      },
      (error) => {
        this.error = 'Orders Not Found!';
      }
    );
  }

  getHighlights() {
    this.ordersService.getOrdersHighlights(
      this.selectedStore.id
    ).subscribe(
      (response: RespOrdersStatus) => {
        this.statusCountList = response.statusCount;
        this.statusCountListTwo = [ 
          {
            title: 'Delivered', 
            code: '',
            count: response.deliveredOrders ? response.deliveredOrders[1] : 0,
            amount: response.deliveredWorth ?? 0
          },
          {
            title: 'Cancelled',
            code: '',
            count: response.cancelledOrders ? response.cancelledOrders[1] : 0,
            amount: response.callededWorth ?? 0
          },
        ]
      }
    )
  }

  /* SETTING ORDERS */
  setListOfOrders(response: RespOrdersList) {
    response.branchPojo.forEach(
      (order) => {
        order.timeLog = {};
        order.timeLog.placed = new Date(order.date);
        order.orderStatusLog?.forEach(
          (log) => {
            if (log.code == "STA104") {
              order.timeLog.delivered = new Date(log.tsServerTime);
            }
          }
        );
        if (order.deliveredTime) {
          const expected = Date.parse(order.deliveredTime);
          order.timeLog.expected = new Date(expected);
        }
      }
    );
    this.orders = response.branchPojo;
    this.count = response.count;
  }

  /* EVENT-HANDLERS */

  onSearch(keyword: string) {
    this.page.orderBy = keyword;
    this.page.page = 0;
    this.getOrdersList();
  }

  onCancelSearch() {
    this.page.orderBy = '';
    this.page.page = 0;
    this.getOrdersList();
  }

  onRefresh() {
    this.getOrdersList();
  }

  onStatusSelected(status: DtStatus) {
    this.page.statusId = status.id;
    this.getOrdersList();
  }

  onStoreSelected(store: DtSelectItem) {
    this.selectedStore = store;
    this.page.branchId = this.selectedStore.id;
    this.getOrdersList();
  }

  onStatusCleared() {
    if (this.page.statusId !== null) {
      this.page.statusId = null;
      this.getOrdersList();
    }
  }

  onFilterByDate(range: DtDateRange) {
    this.page.start = this.datePipe.transform(range.start, "yyyy-MM-dd HH:mm:ss", '+0000');
    this.page.end = this.datePipe.transform(range.end, "yyyy-MM-dd HH:mm:ss", '+0000');
    this.getOrdersList();
  }

  cancelFilterByDate() {
    this.page.start = "";
    this.page.end = "";
    this.page.page = 0;
    this.getOrdersList();
  }

  onPageChanged(event: PageEvent) {
    this.page.page = event.pageIndex;
    this.page.size = event.pageSize;
    this.getOrdersList();
  }

  onSelectOrder(order: RespOrder) {
    this.matDialog.open(OrderDetailsComponent, {
      width: '900px',
      data: {
        id: order.id,
        status: order.status,
        riderId: order.riderId,
        branchId: this.selectedStore.id,
        membershipType: order.membershipType,
        statusLog: order.orderStatusLog,
        timeLog: order.timeLog,
        tat: order.tat,
        appVersion: order.appVersion
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* ON DESTROY */
  ngOnDestroy() {
    this.autoFetch.unsubscribe();
  }

}