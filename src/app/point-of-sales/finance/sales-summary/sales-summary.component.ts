import { Component, OnInit } from '@angular/core';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceDashboard } from 'src/app/core/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { RespDashboardFinance } from 'src/app/core/models/dashboard';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.css']
})
export class SalesSummaryComponent implements OnInit {

  currentStore: DtSelectItem;
  inputDate: Date;
  loading: boolean;
  financeData: RespDashboardFinance;

  constructor(
    private authService: ServiceAuth,
    private dashboardService: ServiceDashboard,
    private datePipe: DatePipe,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {

    this.initStore();
    this.getFinanceData();

    this.inputDate = new Date();
    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.currentStore = store;
        this.getFinanceData();
      }
    );

  }

  getFinanceData() {
    let start = this.datePipe.transform(this.inputDate, "yyyy-MM-dd HH:mm:ss", '+0000');
    console.log("start")
    console.log(start)
    this.loading = true;
    this.dashboardService.getDashboardFinanceData(
      this.currentStore.id, start
    ).subscribe(
      (response: RespDashboardFinance) => {
        this.financeData = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackbarService.showErrorMessage("Can't fetch data!");
      }
    );
  }

  initStore() {
    let id = this.authService.getBranchId();
    let title = this.authService.getBranchName();
    this.currentStore = {
      id,
      title,
      details: null
    }
  }

  onChange(){
    this.getFinanceData();
  }

}
