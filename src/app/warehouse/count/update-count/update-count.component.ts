import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReqWarehouseSheetUpload, DtSheetProduct } from 'src/app/core/models/sheet-product';
import { Router } from '@angular/router';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ReqWarehouseCount, RespPurchaseItem } from 'src/app/core/models/purchases';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { RespStoreLibraryItem } from 'src/app/core/models/inventory';
import { MatTable } from '@angular/material/table';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceWarehouseCount } from 'src/app/core/services/warehouse-count.service';


@Component({
  selector: 'wh-update-count',
  templateUrl: './update-count.component.html',
  styleUrls: ['./update-count.component.css']
})
export class WhUpdateCountComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  countId: number;
  countList: ReqWarehouseSheetUpload;
  
  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  columnsList = [
    'id',
    'title',
    'quantity',
    'delete'
  ];

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private dialogRef: MatDialogRef<WhUpdateCountComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { id: number, count: ReqWarehouseSheetUpload, isApproved: boolean },
    private router: Router,
    private snackbarService: ServiceSnackbar,
    private countService: ServiceWarehouseCount,
  ) { }

  ngOnInit(): void {

    this.countId = this.data.id;
    this.countList = this.data.count;

    this.loading = true;
    this.countService.getCountInfo(this.data.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log(response);
        this.countList.products = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title,
              quantity: item.quantity,
              libraryItemId: item.libraryItemId,
            }
          }
        );
        this.loading = false;
      }
    );

    this.countService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

  }

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    this.router.navigate(['/warehouse/count/history']);
    this.dialogRef.close();
  }

  onUpdate() {
    if (!this.isValid()) {
      this.snackbarService.showErrorMessage("Cost or Quantity can't be zero or less.");
    }
    this.submitting = true;
    this.countList.whPurchaseId = this.countId;
    console.log(JSON.stringify(this.countList));
    let request: ReqWarehouseCount = {
      id: this.data.id,
      whId: this.data.count.whId,
      whCount: this.countList.products,
      countNumber: this.data.count.countNumber
    }
    console.log(request);
    this.submitting = true;
    this.countService.addNewCount(request).subscribe(
      () => {
        this.countService.dataUpdated.emit();
        this.ngOnInit();
        this.router.navigate(['/warehouse/count/history']);
        this.snackbarService.showSuccessMessage("Successfully Updated!");
        this.dialogRef.close();
        this.submitting = false;
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating Data!");
      }
    );
  }

  isValid() {
    let valid = true;
    this.countList.products.forEach(
      (item) => {
        if (item.quantity <= 0) {
          valid = false;
        }
      }
    );
    return valid;
  }

  toggleDelete(product: DtSheetProduct) {
    if (product.state) {
      product.state = null;
    } else {
      product.state = 'D';
    }
  }

  onAddProduct(product: RespStoreLibraryItem) {
    console.log(product);
    this.countList.products.push({
      id: null,
      title: product.title,
      quantity: 1,
      libraryItemId: product.id,
    });
    this.table.renderRows();
  }
}
