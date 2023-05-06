import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { RespStoreLibraryItem } from 'src/app/core/models/inventory';
import { ReqBranchCount, RespPurchaseItem } from 'src/app/core/models/purchases';
import { DtSheetProduct, ReqStoreSheetUpload } from 'src/app/core/models/sheet-product';
import { BranchCountService } from 'src/app/core/services/branch-count.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-branch-update-count',
  templateUrl: './branch-update-count.component.html',
  styleUrls: ['./branch-update-count.component.css']
})
export class BranchUpdateCountComponent implements OnInit {
  loading: boolean;
  submitting: boolean;
  countId: number;
  countList: ReqStoreSheetUpload;
  
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
    private dialogRef: MatDialogRef<BranchUpdateCountComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { id: number, count: ReqStoreSheetUpload, isApproved: boolean },
    private router: Router,
    private snackbarService: ServiceSnackbar,
    private countService: BranchCountService,
  ) { }

  ngOnInit(): void {

    this.countId = this.data.id;
    this.countList = this.data.count;

    this.loading = true;
    this.countService.getCountInfo(this.data.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log(response);
        this.countList.branchProducts = response.map(
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
// to do
  onCancel() {
    this.router.navigate(['/pos/count/history']);
    this.dialogRef.close();
  }

  onUpdate() {
    if (!this.isValid()) {
      this.snackbarService.showErrorMessage("Cost or Quantity can't be zero or less.");
    }
    this.submitting = true;
    this.countList.branchPurchaseId = this.countId;
    console.log(JSON.stringify(this.countList));
    let request: ReqBranchCount = {
      id: this.data.id,
      branchId: this.data.count.branchId,
      branchCount: this.countList.branchProducts,
      countNumber: this.data.count.countNumber
    }
    console.log(request);
    this.submitting = true;
    this.countService.addNewCount(request).subscribe(
      () => {
        this.countService.dataUpdated.emit();
        this.ngOnInit();
        //to do
        this.router.navigate(['/pos/count/history']);
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
    this.countList.branchProducts.forEach(
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
    this.countList.branchProducts.push({
      id: null,
      title: product.title,
      quantity: 1,
      libraryItemId: product.id,
    });
    this.table.renderRows();
  }
}
