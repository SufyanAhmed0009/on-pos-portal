import { Component, OnInit, Inject } from '@angular/core';
import { RespRiderReport } from 'src/app/core/models/rider-report';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-model-biker-orders-details',
  templateUrl: './model-biker-orders-details.component.html',
  styleUrls: ['./model-biker-orders-details.component.css']
})

export class ModelBikerOrdersDetailsComponent implements OnInit {

  /* RIDER REPORT LIST*/
  riderReportList: RespRiderReport[];

  /* MAT-TABLE */
  columnsList = [
    'id',
    'riderName',
    'orderId',
    'orderAmount',
    'status',
    'date'
  ];

  constructor(
    private dialogRef: MatDialogRef<ModelBikerOrdersDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private rider: RespRiderReport[]
  ) { }

  ngOnInit(): void {
    this.riderReportList = this.rider;
  }

  /* CLOSE */
  onClose() {
    this.dialogRef.close();
  }

}
