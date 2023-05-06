import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BranchWiseDailySales, DailySales } from 'src/app/core/models/dashboard';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceDashboard } from 'src/app/core/services/dashboard.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalCorrectionDetailComponent } from '../modal-correction-detail/modal-correction-detail.component';
import { ModalDOSComponent } from '../modal-dos/modal-dos.component';

@Component({
  selector: 'app-daily-sales-summary',
  templateUrl: './daily-sales-summary.component.html',
  styleUrls: ['./daily-sales-summary.component.css']
})
export class DailySalesSummaryComponent implements OnInit {


  /* COLOR CODE LIST */
  colorCode: string[] = ['#0000FF', '#FF0000', '#FF1493', '#008000', '#FFFF00', '#9400D3', '#696969'];
  storesDailySales: BranchWiseDailySales[] = [];

  currentDate: Date;
  parentDate: Date;
  branchIds: number[];
  loading: boolean = true;

  constructor(
    private datePipe: DatePipe,
    private snackbarService: ServiceSnackbar,
    private dashboardService: ServiceDashboard,
    private matDialog: MatDialog,
    private authenticationService: ServiceAuth,
    ) { }

  ngOnInit(): void {
    this.branchIds = this.authenticationService.getUserBranchList();
    console.log("this.branchIds");
    console.log(this.branchIds)
    
    let dte = new Date();
    dte.setDate(dte.getDate() - 1);
    this.currentDate = dte;
    this.parentDate = dte;
    this.getData();
  }

  getData() {
    // this.branchIds = [158, 159, 160, 162, 163, 170, 194];
    let date = this.datePipe.transform(this.currentDate, "yyyy-MM-dd HH:mm:ss");
    console.log("start")
    console.log(date)
    this.loading = true;
    this.dashboardService.getEnablerDailySummary(
      this.branchIds, date
    ).subscribe(
      (response: BranchWiseDailySales[]) => {
        this.storesDailySales = response;
        this.timestampToDate();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackbarService.showErrorMessage("Can't fetch data!");
      }
    );
  }



  onParentDateChange(event) {
    console.log(event.target.value)
    this.storesDailySales.forEach(
      (item) => {
        item.childDate = event.target.value
      }
    )
    this.currentDate = event.target.value;
    this.getData();
  }


  OnChildDateChange(event, data: BranchWiseDailySales) {
    console.log(data)
    this.branchIds = [data.branchId];
    let date = this.datePipe.transform(event.target.value, "yyyy-MM-dd HH:mm:ss");
    console.log(date)
    this.loading = true;
    this.dashboardService.getEnablerDailySummary(
      this.branchIds, date
    ).subscribe(
      (response: BranchWiseDailySales[]) => {
        response.forEach(res => this.storesDailySales.forEach(temp => {
          if (temp.branchId == res.branchId) {
            this.storesDailySales[this.storesDailySales.indexOf(temp)] = res;
            this.timestampToDate();
          }
        }));
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackbarService.showErrorMessage("Can't fetch data!");
      }
    );
  }
  timestampToDate() {
    this.storesDailySales.forEach(temp => {
      temp.childDate = new Date(temp.date);
      console.log(temp.childDate);
    })
  }
  openDos(data:BranchWiseDailySales){
    
    this.matDialog.open(ModalDOSComponent, {
      width: '900px',
      data: data,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }
  onDetail(data:[{comment?:string,costBefore?:number,quantity?:number,currentQuantity?:number}]){
    console.log(data);
    this.matDialog.open(ModalCorrectionDetailComponent, {
      width: '900px',
      data: data,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }
}
