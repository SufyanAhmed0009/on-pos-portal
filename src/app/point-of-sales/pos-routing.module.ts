import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PointOfSalesComponent } from './pos.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SalesSummaryComponent } from './finance/sales-summary/sales-summary.component';
import { GenerateInvoiceComponent } from './invoices/generate-invoice/generate-invoice.component';
import { TransferProductsComponent } from './library/transfer-products/transfer-products.component';
import { ManageProductsComponent } from './inventory/manage-products/manage-products.component';
import { ManagePurchasesComponent } from './purchases/manage-purchases/manage-purchases.component';
import { ManageOrdersComponent } from './orders/manage-orders/manage-orders.component';
import { InvoicesHistoryComponent } from './invoices/invoices-history/invoices-history.component';
import { PurchasesHistoryComponent } from './purchases/purchases-history/purchases-history.component';
import { UploadSheetComponent } from './purchases/upload-sheet/upload-sheet.component';
import { OrdersSalesComponent } from './orders/orders-sales/orders-sales.component';
import { OrdersRiderReportComponent } from './orders/orders-rider-report/orders-rider-report.component';
import { DailySalesSummaryComponent } from './finance/daily-sales-summary/daily-sales-summary.component';
import { StorePrePurchasesUploadSheetComponent } from '../point-of-sales/store-pre-purchases/store-pre-purchases-upload-sheet/store-pre-purchases-upload-sheet.component'
import { StorePrePurchasesHistoryComponent } from '../point-of-sales/store-pre-purchases/store-pre-purchases-history/store-pre-purchases-history.component'
import { StorePurchaseComparisionComponent } from './store-purchase-comparision/store-purchase-comparision/store-purchase-comparision.component';
import { BranchManageCountComponent } from './count/branch-manage-count/branch-manage-count.component';
import { BranchCountHitoryComponentComponent } from './count/branch-count-hitory-component/branch-count-hitory-component.component';

const routes: Routes = [
    {
        path: 'pos',
        component: PointOfSalesComponent,
        canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        children: [
            { path: 'invoices/pos-summary', component: SalesSummaryComponent },
            { path: 'invoices', component: GenerateInvoiceComponent },
            { path: 'invoices/history', component: InvoicesHistoryComponent },
            { path: 'inventory/library-products', component: TransferProductsComponent },
            { path: 'inventory/products', component: ManageProductsComponent },
            //new //
            { path: 'inventory/count', component: BranchManageCountComponent },
            { path: 'count/history', component: BranchCountHitoryComponentComponent },
            //end //
            { path: 'purchases/manage', component: ManagePurchasesComponent },
            { path: 'purchases/upload-sheet', component: UploadSheetComponent },
            { path: 'purchases/history', component: PurchasesHistoryComponent },
            { path: 'orders/manage', component: ManageOrdersComponent },
            { path: 'orders/sales', component: OrdersSalesComponent },
            { path: 'orders/rider-report', component: OrdersRiderReportComponent },
            { path: 'finance/summary', component: SalesSummaryComponent },
            { path: 'finance/summary/2', component: DailySalesSummaryComponent }, // need to be change
            /* PRE-PURCHASES ROUTES */
            { path: 'purchases/pre-purchases', component: StorePrePurchasesUploadSheetComponent },
            { path: 'purchases/pre-purchases/history', component: StorePrePurchasesHistoryComponent },
            
            /* PURCHASE COMPARISION */
            { path: 'purchases/purchase-comparison', component: StorePurchaseComparisionComponent },
           
            { path: '**', component: NotFoundComponent },       
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PointOfSalesRoutingModule { }
