import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css']
})
export class ModalSharedInfoComponent implements OnInit {

  content: string;

  constructor(
    public dialogRef: MatDialogRef<ModalSharedInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: { content: string },
  ) { }

  ngOnInit() {
    this.content = this.modalData.content;
  }
}
