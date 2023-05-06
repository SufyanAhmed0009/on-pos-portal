import { Component, OnInit, Inject } from '@angular/core';
import { ItemHistoryService } from 'src/app/core/services/item-history.service';
import { RespItemHistory } from 'src/app/core/models/item-history';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-item-history-details',
  templateUrl: './item-history-details.component.html',
  styleUrls: ['./item-history-details.component.css']
})
export class ItemHistoryDetailsComponent implements OnInit {

  /* ITEM HISTORY LIST*/
  itemHistoryList: RespItemHistory[];
  isLoading: boolean;

  /* MAT-TABLE */
  columnsList = [
    "id",
    "title",
    "quantity",
    "cost",
    "price",
    "date",
    "status",
    "orderNumber"
  ];

  constructor(
    private itemHistoryService: ItemHistoryService,
    private dialogRef: MatDialogRef<ItemHistoryDetailsComponent>,
    private snackBarService: ServiceSnackbar,
    @Inject(MAT_DIALOG_DATA) public data : { id : number ,dateTime: Date }
  ) { }

  ngOnInit(): void {
    this.getItemList();
  }

  getItemList() : void {
    this.isLoading = true;
    console.log(this.data);
    this.itemHistoryService.itemHistoryListByDate(this.data).subscribe(
      (response: RespItemHistory[])=>{
        this.itemHistoryList = response;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.showErrorMessage("Error Loading Data!");
      }
    );
  }

  onClose(){
    this.dialogRef.close();
  }

}
