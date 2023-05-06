import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { WhManageProductsComponent } from './inventory/manage-products/manage-products.component';
import { WhProductsListComponent } from './inventory/products-list/products-list.component';
import { WhManagePurchasesComponent } from './purchases/manage-purchases/manage-purchases.component';
import { UpdateWhProductComponent } from './inventory/update-product/update-product.component';
import { WhSelectedProductsComponent } from './purchases/selected-products/selected-products.component';
import { WhPurchasesHistoryComponent } from './purchases/purchases-history/purchases-history.component';
import { WhPurchaseDetailsComponent } from './purchases/purchase-details/purchase-details.component';
import { WhUpdateInventoryComponent } from './purchases/update-inventory/update-inventory.component';
import { WhUploadSheetComponent } from './purchases/upload-sheet/upload-sheet.component';
import { WhPrePurchasesHistoryComponent } from './pre-purchases/pre-purchases-history/pre-purchases-history.component';
import { WhPrePurchasesUploadSheetComponent } from './pre-purchases/pre-purchases-upload-sheet/pre-purchases-upload-sheet.component';
import { WhPrePurchaseDetailsComponent } from './pre-purchases/pre-purchase-details/pre-purchase-details.component';
import { WhPurchaseComparisionComponent } from './purchase-comparision/purchase-comparision/purchase-comparision.component';
import { InvoiceHistoryComponent } from "./invoices/invoice-history/invoice-history.component";
import { ManageInvoiceComponent } from "./invoices/manage-invoice/manage-invoice.component";
import { InvoiceDetailsComponent } from "./invoices/invoice-details/invoice-details.component";
import { InvoiceReceiptComponent } from "../point-of-sales/invoices/invoice-receipt/invoice-receipt.component";
import { UpdateInvoiceComponent } from "./invoices/update-invoice/update-invoice.component";
import { WhSelectedInvoiceProductsComponent } from "./invoices/selected-products/selected-products.component";
import { WhUpdateCountComponent } from "./count/update-count/update-count.component";
import { WhCountDetailsComponent } from "./count/count-details/count-details.component";
import { WhCountHistoryComponent } from "./count/count-history/count-history.component";
import { WhManageCountComponent } from "./count/manage-count/manage-count.component";
import { WhCountSelectedProductsComponent } from "./count/selected-products/selected-products.component";
import { ModalPurchaseFileAttachmentsComponent } from './purchases/modal-purchase-file-attachments/modal-purchase-file-attachments.component';


@NgModule({
    declarations: [
        WarehouseComponent,
        NotFoundComponent,
        WhManageProductsComponent,
        WhProductsListComponent,
        WhManagePurchasesComponent,
        UpdateWhProductComponent,
        WhSelectedProductsComponent,
        WhPurchasesHistoryComponent,
        WhPurchaseDetailsComponent,
        WhUpdateInventoryComponent,
        WhUploadSheetComponent,
        WhPrePurchasesHistoryComponent,
        WhPrePurchasesUploadSheetComponent,
        WhPrePurchaseDetailsComponent,
        WhPurchaseComparisionComponent,
        InvoiceDetailsComponent,
        InvoiceHistoryComponent,
        ManageInvoiceComponent,
        UpdateInvoiceComponent,
        WhSelectedInvoiceProductsComponent,

        WhCountHistoryComponent,
        WhCountDetailsComponent,
        WhUpdateCountComponent,
        WhManageCountComponent,
        WhCountSelectedProductsComponent,
        ModalPurchaseFileAttachmentsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        WarehouseRoutingModule
    ],
    exports: [
        WarehouseRoutingModule
    ]
})
export class WarehouseModule { }