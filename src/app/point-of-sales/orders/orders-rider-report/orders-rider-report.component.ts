import { Component, OnInit } from '@angular/core';
import { RiderReportService } from 'src/app/core/services/rider-report.service';
import { RespRiderReportList, RespRiderReport, RiderReport, OrderRiderReportRequest } from 'src/app/core/models/rider-report';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { DtSelectItem } from 'src/app/core/models/select';
import { ModelBikerOrdersDownloadComponent } from '../model-biker-orders-download/model-biker-orders-download.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ModelBikerOrdersDetailsComponent } from '../model-biker-orders-details/model-biker-orders-details.component';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-rider-report',
  templateUrl: './orders-rider-report.component.html',
  styleUrls: ['./orders-rider-report.component.css']
})
export class OrdersRiderReportComponent implements OnInit {

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* RIDER REPORT LIST*/
  riderReportList: RespRiderReport[];
  riderSalesList: RiderReport[] = [];
  loading: boolean;

  /* DATE AND RANGE */
  request: OrderRiderReportRequest;
  currentDate = new FormControl(new Date());
  maxDate = new Date();

  /* MAT-TABLE */
  columnsList = [
    'id',
    'riderName',
    'totalOrders',
    'totalAmount',
  ];

  constructor(
    private riderReportService: RiderReportService,
    private authService: ServiceAuth,
    private languageService: ServiceLanguage,
    private matDialog: MatDialog,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.selectedStore = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.initVariables();
    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.selectedStore = store;
        this.getRiderReportList();
      }
    );
    this.getRiderReportList();
  }

  getRiderReportList() {
    this.loading = true;
    this.request.id = this.selectedStore.id;

    this.riderReportService.getRiderInfoList(this.request).subscribe(
      (response: RespRiderReport[]) => {
        this.riderSalesList = [];
        this.riderReportList = response;
        this.loading = false;
        this.riderReportList.forEach(
          (item) => {
            // Searching for riderId,
            let index = this.riderSalesList.findIndex(
              (rider) => rider.riderId == item.riderId
            );
            // Adding Record if not available.
            if (index == -1) {
              this.riderSalesList.push({
                riderId: item.riderId,
                riderName: item.riderName,
                totalOrders: 0,
                totalSales: 0
              })
            }
          }
        );
        this.riderReportList.forEach(
          (item) => {
            // Searching for riderId,
            let index = this.riderSalesList.findIndex(
              (rider) => rider.riderId == item.riderId
            );
            this.riderSalesList[index].totalOrders += 1;
            this.riderSalesList[index].totalSales += item.orderAmount;
          }
        );
      }
    )
  }


  /* DOWNLOAD EXCEL FILE*/
  onDownload() {
    this.matDialog.open(ModelBikerOrdersDownloadComponent, {
      width: '300px',
      data: this.riderReportList,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* ON SELECT RIDER*/
  onSelectBiker(rider: RespRiderReport) {
    this.matDialog.open(ModelBikerOrdersDetailsComponent, {
      width: '900px',
      data: this.riderReportList.filter(item => item.riderId == rider.riderId),
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* INITIALIZE VARIABLES*/
  initVariables() {
    this.maxDate.setHours(0, 0, 0, 0);
    this.request = {
      id: this.selectedStore.id,
      dateString: this.datePipe.transform(this.maxDate, "yyyy-MM-dd HH:mm:ss", '+0000')
    }
  }

  /*Date Filter */
  dateFilter(date) {
    this.request.dateString = this.datePipe.transform(date.value, "yyyy-MM-dd HH:mm:ss", '+0000');
    this.getRiderReportList();
  }

  /* REFRESH */
  onRefresh() {
    this.getRiderReportList();
  }

}


