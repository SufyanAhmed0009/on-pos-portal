import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-correction-detail',
  templateUrl: './modal-correction-detail.component.html',
  styleUrls: ['./modal-correction-detail.component.css']
})
export class ModalCorrectionDetailComponent implements OnInit {


  response:[{comment?:string,costBefore?:number,quantity?:number,currentQuantity?:number}];
  loading: boolean;
  columnsList = [
    'No',
    'Comment',
    'costBefore',
    'quantity',
    'currentQuantity'
  ]

  constructor(
  @Inject(MAT_DIALOG_DATA) private data: [{comment?:string,costBefore?:number,quantity?:number,currentQuantity?:number}],
  private dialogRef: MatDialogRef<ModalCorrectionDetailComponent>,) { }

  ngOnInit(): void {
   this.response=this.data;
  }
  onClose() {
    this.dialogRef.close();
  }
}
