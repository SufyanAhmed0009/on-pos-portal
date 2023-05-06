import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { DtStoreOfflineProduct } from 'src/app/core/models/products';
import { DtInvoiceProduct, DtInvoiceHighlights, ReqInvoice } from 'src/app/core/models/Invoices';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { MatTable } from '@angular/material/table';
import { ServiceSyncProducts } from 'src/app/core/services/sync-products.service';
import { ServiceInvoice } from 'src/app/core/services/invoice.service';
import { InvoiceReceiptComponent } from '../invoice-receipt/invoice-receipt.component';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceSyncInvoices } from 'src/app/core/services/sync-invoices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {

  loading: boolean;

  extraInfo: DtExtraInfo;

  /* INVOICES */
  invoiceProducts: DtInvoiceProduct[];
  invoiceHighlights: DtInvoiceHighlights;
  pendingInvoices: number;

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  /* FOR TABLE */
  columnsList = [
    'delete',
    'name',
    'quantity',
    'maxQuantity',
    'price',
    'netAmount'
  ];

  constructor(
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private syncProductsService: ServiceSyncProducts,
    private syncInvoicesService: ServiceSyncInvoices,
    private languageService: ServiceLanguage,
    private matDialog: MatDialog,
    private invoiceService: ServiceInvoice,
    private router: Router
  ) { }

  ngOnInit() {

    this.invoiceProducts = [];
    this.resetInvoiceInfo();
    if (this.syncProductsService.getProducts().length == 0){
      this.fetchData();
    }

    this.pendingInvoices = this.syncInvoicesService.getInvoiceSyncList().length;
    this.syncInvoicesService.invoiceAdded.subscribe(
      () => {
        this.pendingInvoices = this.syncInvoicesService.getInvoiceSyncList().length;
        this.resetInvoiceInfo();
        this.invoiceProducts = [];
        this.table.renderRows();
      }
    );


  }

  /* SET INVOICE INFO */
  resetInvoiceInfo() {
    let timestamp = Math.round(Date.now() / 1000);
    this.extraInfo = {
      billNumber: this.authService.getBranchId() + '-' + timestamp,
      date: new Date(),
      referenceNo: '',
      remarks: ''
    }
    this.invoiceHighlights = {
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
      totalDiscount: 0,
      billDiscount: 0,
      netAmount: 0
    };
  }

  /* FETCH DATA */
  fetchData(){
    this.loading = true;
    this.syncProductsService.fetchProducts().subscribe(
      (products: DtStoreOfflineProduct[]) => {
        this.syncProductsService.saveProducts(products);
        this.loading = false;
      }
    );
  }

  /* EVENT HANDLERS */

  onViewHistory() {
    this.router.navigate(['pos/invoices/history']);
  }

  onRefresh() {
    this.fetchData();
  }

  onProductSelected(product: DtStoreOfflineProduct) {
    let already = this.isAlreadyAdded(product);
    if (!already){
      this.addProduct(product);
    } else {
      this.snackbarService.showErrorMessage('Already Added!');
    }
  }

  /* GENERATE INVOICE */
  onGenerate(){
    let invoiceRequest: ReqInvoice = {
      productsList: this.invoiceProducts.map(
        (item) => {
          return { id: item.id, quantity: item.quantity }
        }
      ),
      invoice: {
        billNumber: this.extraInfo.billNumber,
        billDate: new Date(),
        remarks: this.extraInfo.billNumber,
        referenceNumber: this.extraInfo.referenceNo,
        totalItems: this.invoiceHighlights.totalItems,
        totalAmount: this.invoiceHighlights.totalAmount,
        totalDiscount: this.invoiceHighlights.totalDiscount,
        billDiscount: this.invoiceHighlights.billDiscount,
        netAmount: this.invoiceHighlights.netAmount,
        paidAmount: 1000,
        amountReturned: 1000 - this.invoiceHighlights.netAmount,
      },
      storeId: this.authService.getBranchId()
    }
    const initialState = {
      invoiceDetails: invoiceRequest,
      invoiceProducts: this.invoiceProducts
    };
    this.matDialog.open(InvoiceReceiptComponent, {
      width: '510px',
      data: initialState,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }


  /* SYNC INVOICES */
  onSyncInvoices(){
    this.loading = true;
    let pendingInvoices = this.syncInvoicesService.getInvoiceSyncList();
    this.invoiceService.syncPendingInvoices(pendingInvoices).subscribe(
      (response: any) => {
        this.syncInvoicesService.setInvoiceSyncList([]);
        this.syncInvoicesService.invoiceAdded.emit();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.snackbarService.showErrorMessage("Error Sycing Invoices to the server. Try again!");
      }
    );
  }
  

  /* QUANTITY INCREMENTERS AND DECREMENTERS */

  increaseQuantity(product: DtInvoiceProduct) {
    if (product.quantity < product.maxQuantity) {
      product.quantity++;
      this.updateHighlights();
    } else {
      this.snackbarService.showErrorMessage("Can't add more item. Stock limit reached.");
    }
  }
  increaseQuantityByFive(product: DtInvoiceProduct) {
    if ((product.quantity + 5) <= product.maxQuantity) {
      product.quantity += 5;
      this.updateHighlights();
    } else {
      this.snackbarService.showErrorMessage("Can't add more item. Stock limit reached.");
    }
  }
  decreaseQuantity(product: DtInvoiceProduct) {
    if (product.quantity > 0) {
      product.quantity--;
    } else {
      this.snackbarService.showErrorMessage("Quantity can't be less than zero.");
    }
    this.updateHighlights();
  }

  /* REMOVE ITEM FROM LIST */
  removeItem(index: number) {
    this.invoiceProducts.splice(index, 1);
    this.updateHighlights();
    this.table.renderRows();
  }

  /* PRIVATE METHODS */
  
  private isAlreadyAdded(product: DtStoreOfflineProduct): boolean {
    let found = this.invoiceProducts.find((item) => item.barcode == product.barcode);
    return found ? true : false;
  }

  private addProduct(product: DtStoreOfflineProduct){
    let newProduct: DtInvoiceProduct = {
      id: product.id,
      name: product.title,
      barcode: product.barcode,
      maxQuantity: product.quantity,
      quantity: 1,
      amount: product.price,
      price: product.price,
      discount: product.discountAmount,
      totalDiscount: product.discountAmount,
      netAmount: (product.price - product.discountAmount) * 1
    }
    this.invoiceProducts.push(newProduct);
    this.updateHighlights();
    this.table.renderRows();
  }

  private updateHighlights(){
    let totalItems = this.invoiceProducts.length;
    let totalQuantity = 0;
    let totalAmount = 0;
    let totalDiscount = 0;
    let netAmount = 0;
    this.invoiceProducts.forEach(
      (product) => {
        totalQuantity += product.quantity;
        totalAmount += product.amount * product.quantity,
          totalDiscount += product.totalDiscount * product.quantity;
      }
    )
    netAmount = totalAmount - totalDiscount;
    this.invoiceHighlights.billDiscount = 0;
    this.invoiceHighlights.totalAmount = totalAmount;
    this.invoiceHighlights.totalDiscount = totalDiscount;
    this.invoiceHighlights.totalItems = totalItems;
    this.invoiceHighlights.totalQuantity = totalQuantity;
    this.invoiceHighlights.netAmount = netAmount;
  }

}

class DtExtraInfo {
  billNumber: string;
  date: Date;
  referenceNo: string;
  remarks: string;
}