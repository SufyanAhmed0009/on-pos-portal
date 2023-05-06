import { Component, OnInit } from '@angular/core';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { DtPurchaseProduct, RespStoreProduct } from 'src/app/core/models/products';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ReqPurchase, ReqPurchaseItem } from 'src/app/core/models/purchases';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog } from '@angular/material/dialog';
import { DtSelectItem } from 'src/app/core/models/select';

@Component({
  selector: 'app-manage-purchases',
  templateUrl: './manage-purchases.component.html',
  styleUrls: ['./manage-purchases.component.css']
})
export class ManagePurchasesComponent implements OnInit {

  selectedStore: number;
  currentStore: number;
  purchaseProducts: DtPurchaseProduct[];
  whControl: FormControl;
  whList: SelectItem[] = [];
  selectedWh: number;
  deliveryOrderNo: string;
  suppliersList: DtSupplier[];
  selectedSupplier: number;

  selectedPOId: number;
  PurchaseOrderList: DtSelectItem[];

  /* LOADER */
  submitting: boolean;

  /* SHOW TITLE CONDITION */
  showTitle: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private purchasesService: ServicePurchases,
    private router: Router,
    private suppliersService: ServiceWarehouseSuppliers,
    private whPurchaseService: ServiceWarehousePurchases,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {

    this.purchaseProducts = [];
    this.selectedStore = this.authService.getBranchId();
    this.whControl = new FormControl();
    this.purchasesService.getListOfWh().subscribe(
      (response: any[]) => {
        this.whList = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title
            }
          }
        );
      }
    );
    this.suppliersList = [];
    this.suppliersService.getListOfAllSuppliers().subscribe(
      (response: DtSupplier[]) => {
        this.suppliersList = response;
      }
    );

    this.purchasesService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      });

    this.purchasesService.getPurchaseOrderList(this.selectedStore).subscribe(
      (response: DtSelectItem[]) => {
        console.log(response)
        this.PurchaseOrderList = response;
      }
    )

  }

  getTotalCost() {
    let sum = 0;
    this.purchaseProducts.forEach(
      (item) => {
        sum += (item.cost * item.quantity);
      }
    )
    return sum;
  }

  /* EVENT-HANDLERS */

  onHistory() {
    this.router.navigate(['/pos/purchases/history']);
  }

  onAddProduct(product: RespStoreProduct) {
    if (!this.selectedWh) {
      this.snackbarService.showErrorMessage("Please select warehouse!")
      return;
    }
    let index = this.purchaseProducts.findIndex((item) => item.id == product.id);
    if (index == -1) {
      let products = this.purchaseProducts.map((item) => item);
      products.unshift({
        id: product.id,
        name: product.title,
        barcode: product.barcode,
        retailPrice: product.retailPrice,
        quantity: 1,
        totalQuantity: product.quantity,
        unapprovedQuantity: product.unapprovedQuantity,
        cost: product.price, //this is price from wh item
        price: 0,
        strategyId: 2,
        itemCost: 1 * product.price,
        whCost: product.cost
      });
      this.purchaseProducts = products;
      console.log("this.purchaseProducts")
      console.log(this.purchaseProducts)
    } else {
      if (this.purchaseProducts[index].quantity < (this.purchaseProducts[index].totalQuantity - this.purchaseProducts[index].unapprovedQuantity) ) {
        this.purchaseProducts[index].quantity++;
        this.purchaseProducts[index].itemCost = this.purchaseProducts[index].cost *
          this.purchaseProducts[index].quantity;
      } else {
        this.snackbarService.showErrorMessage("Max limit reached. Total quantity in Warehouse: " + (this.purchaseProducts[index].totalQuantity - this.purchaseProducts[index].unapprovedQuantity));
      }
    }
    console.log("this.purchaseProducts")
    console.log(this.purchaseProducts)

  }

  onAddPurchase() {

    if (this.areValuesValid()) {
      this.sendPurchaseRequest();
    } else {
      this.snackbarService.showErrorMessage("Cost or quantity can't be negative!")
    }

  }

  onSupplierSelected() {
    if (this.selectedSupplier) {
      this.selectedWh = null;
      this.whPurchaseService.warehouseSelected.emit();
    }
    this.purchasesService.supplierSelected.emit(this.selectedSupplier);
  }

  onWarehouseSelected() {
    if (this.selectedWh) {
      this.selectedSupplier = null;
      this.purchasesService.supplierSelected.emit();
    }
    this.whPurchaseService.warehouseSelected.emit(this.selectedWh);
  }

  sendPurchaseRequest() {
    this.currentStore = this.authService.getBranchId();
    let branchId = this.selectedStore;
    if (this.selectedStore != this.currentStore) {
      branchId = this.currentStore;
    }
    let request: ReqPurchase = {
      branchPurchaseList: this.purchaseProducts.map(
        (purchaseItem) => {
          let requestItem: ReqPurchaseItem = {
            item: {
              id: purchaseItem.id
            },
            branch: {
              id: branchId
            },
            quantity: purchaseItem.quantity,
            cost: purchaseItem.cost,
            pricingStrategy: {
              id: purchaseItem.strategyId,
            }
          }
          if (purchaseItem.strategyId == 3 || purchaseItem.strategyId == 4) {
            requestItem.price = purchaseItem.price;
          }
          return requestItem;
        }
      ),
      prePurchaseId: this.selectedPOId,
      purchaseTransaction: {
        branch: { id: branchId },
        wh: this.selectedWh == null ? null : { id: this.selectedWh },
        supplier: this.selectedWh != null ? null : { id: this.selectedSupplier },
        deliveryOrderNo: this.deliveryOrderNo
      }
    }
    console.log(JSON.stringify(request))

    if (this.isHighlighted() != 0) {
      let confirmData: DtConfirmMessage = {
        message: "Difference between cost and price is less or greater than 20%. Do You Want To Continue?",
        confirm: "Go Ahead!",
        cancel: "Cancel"
      }

      let dialogRef = this.matDialog.open(ConfirmDialogComponent, {
        width: '400px',
        direction: <Direction>this.languageService.getCurrentLanguage().dir,
        data: confirmData,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(
        (data) => {
          if (data == true) {
            this.submitting = true;
            this.purchasesService.addNewPurchase(request).subscribe(
              () => {
                this.submitting = false;
                this.snackbarService.showSuccessMessage("Successfully Added");
                this.router.navigate(['/pos/purchases/history']);
              },
              (error) => {
                this.submitting = false;
                this.snackbarService.showErrorMessage("Error Adding Purchase");
              }
            );
          }
        });
    }
    else {
      this.submitting = true;
      this.purchasesService.addNewPurchase(request).subscribe(
        () => {
          this.submitting = false;
          this.snackbarService.showSuccessMessage("Successfully Added");
          this.router.navigate(['/pos/purchases/history']);
        },
        (error) => {
          this.submitting = false;
          this.snackbarService.showErrorMessage("Error Adding Purchase");
        }
      );
    }
  }

  areValuesValid() {
    let valid = true;
    this.purchaseProducts.forEach(
      (item) => {
        if (item.cost == null) {
          item.cost = 0;
        }
        if (item.cost < 0) {
          valid = false;
        }
        if (item.quantity < 0) {
          valid = false;
        }
      }
    );
    return valid;
  }

  isHighlighted() {
    let num = 0;
    this.purchaseProducts.forEach(
      (item) => {
        if (item.highCost || item.lowCost) {
          num++;
        }
      }
    );
    return num;
  }

  clearWHSelection() {
    this.selectedWh = null;
    this.whPurchaseService.warehouseSelected.emit();
  }

  clearSupplierSelection() {
    this.selectedSupplier = null;
    this.purchasesService.supplierSelected.emit();
  }

}

class SelectItem {
  id: number;
  title: string;
}