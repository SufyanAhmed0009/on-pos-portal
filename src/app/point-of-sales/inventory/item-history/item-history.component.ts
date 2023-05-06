import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RespItemHistory } from 'src/app/core/models/item-history';
import { ItemHistoryService } from 'src/app/core/services/item-history.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemHistoryDetailsComponent } from '../item-history-details/item-history-details.component';
import { Direction } from '@angular/cdk/bidi';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
@Component({
  selector: 'app-item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.css']
})
export class ItemHistoryComponent implements OnInit {


  /* ITEM HISTORY LIST*/
  itemHistoryList: RespItemHistory[];
  isLoading: Boolean;

  /* DATE AND RANGE */
  currentDate = new FormControl(new Date());
  maxDate = new Date();
  range: number;

  /* MAT-TABLE */
  columnsList = [
    "id",
    "title",
    "quantity",
    "cost",
    "price",
    "date",
    "status"
  ];
  constructor(
    private dialogRef: MatDialogRef<ItemHistoryComponent>,
    private itemHistoryService: ItemHistoryService,
    private languageService: ServiceLanguage,
    private matDialog: MatDialog,
    private snackBarService: ServiceSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, range: number, dateTime: Date }
  ) { }

  ngOnInit(): void {
    this.getItemHistoryList();
  }

  getItemHistoryList(): void {
    this.isLoading = true;
    this.itemHistoryService.itemHistoryList(this.data).subscribe(
      (response: RespItemHistory[]) => {
        this.itemHistoryList = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.showErrorMessage("Error Loading Data!");
      }
    );
  }

  /*Date Filter */
  dateFilter(date) {
    this.data.dateTime = date.value;
    this.getItemHistoryList();
  }

  /* Range Filter */
  rangeFilter(range) {
    range = Number(range);
    this.data.range = range;
    this.getItemHistoryList();
  }

  onSelectItem(item: RespItemHistory) {
    this.matDialog.open(ItemHistoryDetailsComponent, {
      width: '900px',
      data: {
        id: item.id,
        dateTime: item.date
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* CLOSE */
  onClose() {
    this.dialogRef.close();
  }

}
