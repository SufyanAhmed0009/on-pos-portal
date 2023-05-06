import { Component, OnInit } from '@angular/core';
import { DtWhPurchaseProduct, RespWarehouseProduct } from 'src/app/core/models/products';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { Router } from '@angular/router';
import { DtSelectItem } from 'src/app/core/models/select';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ReqWarehouseInvoice, ReqWarehouseInvoiceItem } from 'src/app/core/models/invoice';
import { ServiceWarehouseInvoice } from 'src/app/core/services/warehouse-invoice.service';

@Component({
  selector: 'app-manage-invoice',
  templateUrl: './manage-invoice.component.html',
  styleUrls: ['./manage-invoice.component.css']
})
export class ManageInvoiceComponent implements OnInit {

  selectedWarehouse: number;
  invoiceProducts: DtWhPurchaseProduct[];
  customerList: DtSupplier[];
  invoiceNo: string;
  selectedCustomer: number;

  /* LOADER */
  submitting: boolean;

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private invoiceService: ServiceWarehouseInvoice,
    private suppliersService: ServiceWarehouseSuppliers,
    private router: Router,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {
    this.invoiceProducts = [];
    this.selectedWarehouse = this.authService.getBranchId();
    this.authService.storeChanged.subscribe(
      (warehouse: DtSelectItem) => {
        this.selectedWarehouse = warehouse.id;
      }
    );
    this.customerList = [];
    this.suppliersService.getListOfAllCustomers().subscribe(
      (response: DtSupplier[]) => {
        this.customerList = response;
      }
    );

    this.invoiceService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

  }

  getTotalCost() {
    let sum = 0;
    this.invoiceProducts.forEach(
      (item) => {
        sum += (item.cost * item.quantity);
      }
    )
    return sum;
  }

  /* EVENT-HANDLERS */
  onHistory() {
    this.router.navigate(['/warehouse/invoices/history']);
  }

  onAddProduct(product: RespWarehouseProduct) {
    let index = this.invoiceProducts.findIndex((item) => item.id == product.id);
    if (index == -1) {
      let products = this.invoiceProducts.map((item) => item);
      products.unshift({
        id: product.id,
        name: product.title,
        barcode: product.barcode,
        retailPrice: product.retailPrice,
        quantity: 1,
        cost: product.cost,
        price: 0,
        strategyId: 8,
        itemCost: product.cost
      });
      this.invoiceProducts = products;
    } else {
      this.invoiceProducts[index].quantity++;
    }

  }

  onAddInvoice() {
    if (this.areValuesValid()) {
      this.sendInvoiceRequest();
    } else {
      this.snackbarService.showErrorMessage("Cost or quantity can't be negative!")
    }
  }

  sendInvoiceRequest() {
    let request: ReqWarehouseInvoice = {
      whInvoiceList: this.invoiceProducts.map(
        (invoiceItem) => {
          let requestItem: ReqWarehouseInvoiceItem = {
            item: {
              id: invoiceItem.id
            },
            wh: {
              id: this.selectedWarehouse
            },
            quantity: invoiceItem.quantity,
            cost: invoiceItem.cost,
            pricingStrategy: {
              id: invoiceItem.strategyId,
            }
          }
          if (invoiceItem.strategyId == 3 || invoiceItem.strategyId == 4) {
            requestItem.price = invoiceItem.price;
          }
          return requestItem;
        }
      ),
      whInvoiceTransaction: {
        wh: { id: this.selectedWarehouse },
        customer: { id: this.selectedCustomer },
        invoiceNo: this.invoiceNo,
      }
    }
    console.log(request);
    if (this.isHighlighted() != 0) {
      let confirmData: DtConfirmMessage = {
        message: "Price difference between cost and price is less or greater than 20%. Do You Want To Continue?",
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
            this.addInvoice(request);
          }
        }
      );
    }
    else {
      this.addInvoice(request);
    }
  }

  addInvoice(request) {
    console.log(request);
    this.submitting = true;
    this.invoiceService.addNewInvoice(request).subscribe(
      () => {
        this.submitting = false;
        this.snackbarService.showSuccessMessage("Successfully Added");
        this.router.navigate(['/warehouse/invoices/history']);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Adding Invoice");
      }
    );
  }

  areValuesValid() {
    let valid = true;
    this.invoiceProducts.forEach(
      (item) => {
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
    this.invoiceProducts.forEach(
      (item) => {
        if (item.highCost || item.lowCost) {
          num++;
        }
      }
    );
    return num;
  }
}