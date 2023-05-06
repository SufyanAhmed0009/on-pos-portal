import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReqWarehouseSheetUpload, DtSheetProduct } from 'src/app/core/models/sheet-product';
import { Router } from '@angular/router';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { RespPurchaseItem } from 'src/app/core/models/purchases';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { RespStoreLibraryItem } from 'src/app/core/models/inventory';
import { MatTable } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceWarehouseInvoice } from 'src/app/core/services/warehouse-invoice.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';


@Component({
  selector: 'wh-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.css']
})
export class UpdateInvoiceComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  selectedWarehouse: number;
  invoiceId: number;
  invoiceRequest: ReqWarehouseSheetUpload;
  isApproved: boolean;
  pricingStrategyList: DtPricingStrategy[];
  customerList: DtSupplier[];

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  columnsList = [
    'id',
    'title',
    'cost',
    'quantity',
    'strategy',
    'price',
    'retailPrice',
    'delete'
  ];

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private dialogRef: MatDialogRef<UpdateInvoiceComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: { id: number, invoice: ReqWarehouseSheetUpload, isApproved: boolean },
    private router: Router,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private invoiceService: ServiceWarehouseInvoice,
    private suppliersService: ServiceWarehouseSuppliers,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {
    this.selectedWarehouse = this.authService.getBranchId();
    this.invoiceService.getPricingStrategyList('W').subscribe(
      (response: any[]) => {
        this.pricingStrategyList = response;
      }
    );

    this.customerList = [];
    this.suppliersService.getListOfAllCustomers().subscribe(
      (response: DtSupplier[]) => {
        this.customerList = response;
      }
    );

    this.invoiceId = this.data.id;
    this.invoiceRequest = this.data.invoice;
    this.isApproved = this.data.isApproved;

    this.loading = true;
    this.invoiceService.getInvoiceInfo(this.data.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log(response);
        this.invoiceRequest.products = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title,
              cost: item.cost,
              price: item.price ?? 0,
              quantity: item.quantity,
              libraryItemId: item.libraryItemId,
              pricingStrategy: item.pricingStrat,
              retailPrice: item.retailPrice
            }
          }
        );
        this.loading = false;
      }
    );

    this.invoiceService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

  }

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    this.router.navigate(['/warehouse/invoices/history']);
    this.dialogRef.close();
  }

  isHighlighted() {
    let num = 0;
    this.invoiceRequest.products.forEach(
      (item) => {
        if (item.highPrice || item.lowPrice) {
          num++;
        }
      }
    );
    return num;
  }

  onUpdate(approve: boolean) {
    if (!this.isValid()) {
      this.snackbarService.showErrorMessage("Cost or Quantity can't be zero or less.");
    }
    else if (this.isHighlighted() != 0) {

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
            this.updateInvoice(approve);
          }
        }
      );
    }
    else {
      this.updateInvoice(approve);
    }
  }

  updateInvoice(approve) {
    this.submitting = true;
    this.invoiceRequest.whInvoiceId = this.invoiceId;
    console.log(JSON.stringify(this.invoiceRequest));
    this.invoiceService.updateInvoice(this.invoiceRequest).subscribe(
      (response) => {
        this.invoiceService.dataUpdated.emit();
        if (approve) {
          this.onApprove();
        } else {
          this.ngOnInit();
          this.snackbarService.showSuccessMessage("Successfully Updated!");
          this.submitting = false;
        }

      },
      (error) => {
        this.snackbarService.showErrorMessage("Error updating data!");
        this.submitting = false;
      }
    );
  }

  onApprove() {
    this.submitting = true;
    this.invoiceService.confirmSheetUpload(this.invoiceId).subscribe(
      () => {
        this.submitting = false;
        this.isApproved = true;
        this.router.navigate(['/warehouse/invoices/history']);
        this.invoiceService.dataUpdated.emit();
        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        this.snackbarService.showErrorMessage("Error updating status.");
        this.submitting = false;
      }
    );
  }

  isValid() {
    let valid = true;
    this.invoiceRequest.products.forEach(
      (item) => {
        if (item.cost <= 0) {
          valid = false;
        }
        if (item.quantity <= 0) {
          valid = false;
        }
        // if (item.price <= 0) {
        //   valid = false;
        // }
      }
    );
    return valid;
  }

  onSelectPricingStrategy(change: MatSelectChange) {
    let value: number = change.value;
    this.invoiceRequest.products.forEach((item) => {
      item.pricingStrategy = value;
    });
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
    console.log(this.invoiceRequest.products);
    let index = this.invoiceRequest.products.findIndex((item) => item.libraryItemId == product.id);
    if (index == -1) {
    // this.invoiceRequest.products.push({
    let products = this.invoiceRequest.products.map((item) => item);
      products.unshift({
      id: null,
      title: product.title,
      cost: product.cost,
      quantity: 1,
      libraryItemId: product.id,
      pricingStrategy: 5,
      price: 0
    });
    this.invoiceRequest.products = products;
    } else {
      this.invoiceRequest.products[index].quantity++;
    }
    this.table.renderRows();
  }

  priceCheck(product: DtSheetProduct) {
    if (product.price && product.cost) {
      let costPercent = product.cost * 20 / 100;
      let high = product.cost + costPercent;
      let low = product.cost - costPercent;
      if (product.price > high) {
        product.highPrice = true;
        product.lowPrice = false;
      }
      else if (product.price < low) {
        product.lowPrice = true;
        product.highPrice = false;
      }
      else {
        product.highPrice = false;
        product.lowPrice = false;
      }
    }
    return product;
  }

}
