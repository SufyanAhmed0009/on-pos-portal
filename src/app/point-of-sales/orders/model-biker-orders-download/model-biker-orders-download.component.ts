import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { RiderReportService } from 'src/app/core/services/rider-report.service';
import { RespRiderReportList, RespRiderReport } from 'src/app/core/models/rider-report';

@Component({
  selector: 'app-model-biker-orders-download',
  templateUrl: './model-biker-orders-download.component.html',
  styleUrls: ['./model-biker-orders-download.component.css']
})
export class ModelBikerOrdersDownloadComponent implements OnInit {

  isDownloadable: boolean;
  currentProgress: number;
  showProgressBar: boolean = false;
  sheetData: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private riderList: RespRiderReport[],
    private dialogRef: MatDialogRef<ModelBikerOrdersDownloadComponent>,
    private languageService: ServiceLanguage,
    private bikerService: RiderReportService,
    private spreadsheetService: ServiceSpreadsheet
  ) { }

  ngOnInit() {
    this.currentProgress = 0;
    this.showProgressBar = true;

    setTimeout(
      () => {
        if (this.currentProgress == 0) {
          this.currentProgress = 20;
        }
      }, 250
    );
    this.sheetData = this.riderList.map(
      (item) => {
        return {
          "Rider Id": item.riderId,
          "Rider Name": item.riderName,
          "Order Id": item.orderId,
          "Order Amount": item.orderAmount,
          "Status": item.status,
          "Date": item.tsUpd
        };
      }
    );
    this.isDownloadable = true;
    this.currentProgress = 100;
  }

  onSave() {
    this.spreadsheetService.exportAsExcelFile(this.sheetData, 'biker-orders');
    this.dialogRef.close();
  }

}
