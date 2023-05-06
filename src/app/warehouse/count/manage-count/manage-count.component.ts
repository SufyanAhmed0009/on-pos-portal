import { Component, OnInit } from '@angular/core';
import { DtWhPurchaseProduct, RespWarehouseProduct } from 'src/app/core/models/products';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { Router } from '@angular/router';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ReqWarehousePurchaseItem, ReqWarehousePurchase, ReqWarehouseCount, RespPurchaseItem } from 'src/app/core/models/purchases';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceWarehouseCount } from 'src/app/core/services/warehouse-count.service';

@Component({
  selector: 'app-manage-count',
  templateUrl: './manage-count.component.html',
  styleUrls: ['./manage-count.component.css']
})
export class WhManageCountComponent implements OnInit {

  selectedWarehouse: number;
  products: RespPurchaseItem[];
  countNo: string;
  
  /* LOADER */
  submitting: boolean;

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  constructor(
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private countService: ServiceWarehouseCount,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.products = [];
    this.selectedWarehouse = this.authService.getBranchId();
    this.authService.storeChanged.subscribe(
      (warehouse: DtSelectItem) => {
        this.selectedWarehouse = warehouse.id;
      }
    );
  
    this.countService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

  }

  /* EVENT-HANDLERS */
  onHistory() {
    this.router.navigate(['/warehouse/count/history']);
  }

  onAddProduct(product: RespWarehouseProduct) {
    let index = this.products.findIndex((item) => item.libraryItemId == product.id);
    if (index == -1) {
      let products = this.products.map((item) => item);
      products.unshift({
        libraryItemId: product.id,
        title: product.title,
        retailPrice: product.retailPrice,
        quantity: 1,
        cost: 0,
        price: 0
      });
      this.products = products;
      console.log("this.purchaseProducts")
      console.log(this.products)
    } else {
      this.products[index].quantity++;
      // this.snackbarService.showInfoMessage("Already Added!");
    }

  }

  onAddCount() {
    if (this.areValuesValid()) {
      this.sendPurchaseRequest();
    } else {
      this.snackbarService.showErrorMessage("Quantity can't be negative!")
    }
  }

  sendPurchaseRequest() {
    let request: ReqWarehouseCount = {
      whId: this.selectedWarehouse,
      whCount: this.products,
      countNumber: this.countNo
    }
    console.log(request);
    this.submitting = true;
    this.countService.addNewCount(request).subscribe(
      () => {
        this.submitting = false;
        this.snackbarService.showSuccessMessage("Successfully Added");
        this.router.navigate(['/warehouse/count/history']);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Adding Count");
      }
    );
  }

  areValuesValid() {
    let valid = true;
    this.products.forEach(
      (item) => {
        if (item.quantity < 0) {
          valid = false;
        }
      }
    );
    return valid;
  }
}
  
export class DtPurchaseOrder{
  id: number;
  title: string;
}