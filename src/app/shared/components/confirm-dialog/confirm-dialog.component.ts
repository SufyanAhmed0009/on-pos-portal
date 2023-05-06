import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DtConfirmMessage } from 'src/app/core/models/confirm';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DtConfirmMessage
  ) { }

  ngOnInit() {

  }

  onConfirm(){
    this.dialogRef.close(true);
  }
 
  onCancel(){
    this.dialogRef.close();
  }

}
