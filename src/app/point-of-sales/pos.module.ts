import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PointOfSalesComponent } from './pos.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PointOfSalesRoutingModule } from './pos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SalesSummaryComponent } from './finance/sales-summary/sales-summary.component';
import { GenerateInvoiceComponent } from './invoices/generate-invoice/generate-invoice.component';
import { TransferProductsComponent } from './library/transfer-products/transfer-products.component';
import { ManageProductsComponent } from './inventory/manage-products/manage-products.component';
import { ManagePurchasesComponent } from './purchases/manage-purchases/manage-purchases.component';
import { ManageOrdersComponent } from './orders/manage-orders/manage-orders.component';
import { ProductsListComponent } from './inventory/products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { InvoiceReceiptComponent } from './invoices/invoice-receipt/invoice-receipt.component';
import { InvoicesHistoryComponent } from './invoices/invoices-history/invoices-history.component';
import { InvoicesListComponent } from './invoices/invoices-list/invoices-list.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { SelectedProductsComponent } from './purchases/selected-products/selected-products.component';
import { PurchasesHistoryComponent } from './purchases/purchases-history/purchases-history.component';
import { PurchaseDetailsComponent } from './purchases/purchase-details/purchase-details.component';
import { TransferProductsListComponent } from './library/transfer-products-list/transfer-products-list.component';
import { UpdateQuantityComponent } from './inventory/update-quantity/update-quantity.component';
import { UploadSheetComponent } from './purchases/upload-sheet/upload-sheet.component';
import { UpdateProductComponent } from './inventory/update-product/update-product.component';
import { OrdersSalesComponent } from './orders/orders-sales/orders-sales.component';
import { OrdersRiderReportComponent } from './orders/orders-rider-report/orders-rider-report.component';
import { UpdateInventoryComponent } from './purchases/update-inventory/update-inventory.component';
import { ModelBikerOrdersDownloadComponent } from './orders/model-biker-orders-download/model-biker-orders-download.component';
import { ModelBikerOrdersDetailsComponent } from './orders/model-biker-orders-details/model-biker-orders-details.component';
import { ItemHistoryComponent } from './inventory/item-history/item-history.component';
import { ItemHistoryDetailsComponent } from './inventory/item-history-details/item-history-details.component';
import { DailySalesSummaryComponent } from './finance/daily-sales-summary/daily-sales-summary.component';
import { ModalDOSComponent } from './finance/modal-dos/modal-dos.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModalInventoryAdminProductsDownloadComponent } from './inventory/modal-admin-products-download/modal-admin-products-download.component';
import { BrowserModule } from '@angular/platform-browser';
import { ModalCorrectionDetailComponent } from './finance/modal-correction-detail/modal-correction-detail.component';
import { ItemConversionComponent } from './inventory/item-conversion/item-conversion.component';
import { StorePrePurchasesHistoryComponent } from './store-pre-purchases/store-pre-purchases-history/store-pre-purchases-history.component';
import { StorePrePurchasesDetailsComponent } from './store-pre-purchases/store-pre-purchases-details/store-pre-purchases-details.component';
import { StorePrePurchasesUploadSheetComponent } from './store-pre-purchases/store-pre-purchases-upload-sheet/store-pre-purchases-upload-sheet.component';
import { StorePurchaseComparisionComponent } from './store-purchase-comparision/store-purchase-comparision/store-purchase-comparision.component';
import { BranchCountDetailsComponent } from './count/branch-count-details/branch-count-details.component';
import { BranchCountHitoryComponentComponent } from './count/branch-count-hitory-component/branch-count-hitory-component.component';
import { BranchManageCountComponent } from './count/branch-manage-count/branch-manage-count.component';
import { BranchSelectedProductsComponent } from './count/branch-selected-products/branch-selected-products.component';
import { BranchUpdateCountComponent } from './count/branch-update-count/branch-update-count.component';

@NgModule({
  declarations: [
    PointOfSalesComponent,
    NotFoundComponent,
    SalesSummaryComponent,
    GenerateInvoiceComponent,
    TransferProductsComponent,
    ManageProductsComponent,
    ModalInventoryAdminProductsDownloadComponent,
    ManagePurchasesComponent,
    ManageOrdersComponent,
    ProductsListComponent,
    OrdersListComponent,
    OrderDetailsComponent,
    InvoiceReceiptComponent,
    InvoicesHistoryComponent,
    InvoicesListComponent,
    InvoiceDetailsComponent,
    SelectedProductsComponent,
    PurchasesHistoryComponent,
    PurchaseDetailsComponent,
    TransferProductsListComponent,
    UpdateQuantityComponent,
    UploadSheetComponent,
    UpdateProductComponent,
    OrdersSalesComponent,
    OrdersRiderReportComponent,
    UpdateInventoryComponent,
    ModelBikerOrdersDownloadComponent,
    ModelBikerOrdersDetailsComponent,
    ItemHistoryComponent,
    ItemHistoryDetailsComponent,
    DailySalesSummaryComponent,
    ModalDOSComponent,
    ModalCorrectionDetailComponent,
    ItemConversionComponent,
    StorePrePurchasesHistoryComponent,
    StorePrePurchasesDetailsComponent,
    StorePrePurchasesUploadSheetComponent,
    StorePurchaseComparisionComponent,
    BranchCountDetailsComponent,
    BranchCountHitoryComponentComponent,
    BranchManageCountComponent,
    BranchSelectedProductsComponent,
    BranchUpdateCountComponent


  

  ],
  imports: [
    CommonModule,
    PointOfSalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressBarModule,
    BrowserModule 
  ],
  exports: [
    PointOfSalesRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class PointOfSalesModule { }
