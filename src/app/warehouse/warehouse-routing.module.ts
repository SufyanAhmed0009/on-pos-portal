import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { WhManageProductsComponent } from './inventory/manage-products/manage-products.component';
import { WhManagePurchasesComponent } from './purchases/manage-purchases/manage-purchases.component';
import { WhUploadSheetComponent } from './purchases/upload-sheet/upload-sheet.component';
import { WhPurchasesHistoryComponent } from './purchases/purchases-history/purchases-history.component';
import { WhPrePurchasesUploadSheetComponent } from './pre-purchases/pre-purchases-upload-sheet/pre-purchases-upload-sheet.component';
import { WhPrePurchasesHistoryComponent } from './pre-purchases/pre-purchases-history/pre-purchases-history.component';
import { WhPurchaseComparisionComponent } from './purchase-comparision/purchase-comparision/purchase-comparision.component';
import { ManageInvoiceComponent } from './invoices/manage-invoice/manage-invoice.component';
import { InvoiceHistoryComponent } from './invoices/invoice-history/invoice-history.component';
import { WhManageCountComponent } from './count/manage-count/manage-count.component';
import { WhCountHistoryComponent } from './count/count-history/count-history.component';

const routes: Routes = [
    {
        path: 'warehouse',
        component: WarehouseComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'purchases/upload-sheet', component: WhUploadSheetComponent },
            { path: 'purchases/history', component: WhPurchasesHistoryComponent },
            { path: 'purchases/manage', component: WhManagePurchasesComponent },
            
            /* INVENTORY ROUTES */
            { path: 'inventory/products', component: WhManageProductsComponent },
            { path: 'inventory/count', component: WhManageCountComponent },
            { path: 'count/history', component: WhCountHistoryComponent },

            /* PRE-PURCHASES ROUTES */
            { path: 'purchases/pre-purchases', component: WhPrePurchasesUploadSheetComponent },
            { path: 'purchases/pre-purchases/history', component: WhPrePurchasesHistoryComponent },
            
            /* PURCHASE COMPARISION */
            { path: 'purchases/purchase-comparison', component: WhPurchaseComparisionComponent },

            /* INVOICE ROUTES */
            { path: 'invoices/history', component: InvoiceHistoryComponent },
            { path: 'invoices/manage', component: ManageInvoiceComponent },

            { path: '**', component: NotFoundComponent },
        ]
    }
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule {}