import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { ReqWarehouseSheetUpload } from '../models/sheet-product';
import { ReqWarehouseInvoice } from '../models/invoice';

@Injectable({
    providedIn: 'root'
})
export class ServiceWarehouseInvoice {

    dataUpdated = new EventEmitter<void>();
    warehouseSelected = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    addNewInvoice(request: ReqWarehouseInvoice) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVOICE.POST.ADD_INVOICE,
            request
        );
    }

    getInvoiceList(page: DtPage) {
        page.languageId = this.languageService.getCurrentLanguage().id;
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_INVOICE.POST.INVOICE_LIST,
            page
        );
    }

    getInvoiceInfo(invoiceId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        return this.http.get(
            AppConstants.SERVER_READONLY_URL +
            ApiConstants._WAREHOUSE_INVOICE.GET.INVOICE_INFO + invoiceId + '/' + langId
        );
    }

    uploadSheet(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.UPLOAD_SHEET,
            request
        );
    }

    confirmSheetUpload(invoiceId: number) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVOICE.POST.CONFIRM_UPLOAD_SHEET,
            { whInvoiceId: invoiceId, approve: true }
        );
    }

    updateInvoice(request: ReqWarehouseSheetUpload) {
        return this.http.put(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVOICE.PUT.UPDATE_INVOICE,
            request
        );
    }

    showTitle(){
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVOICE.GET.SHOW_TITLE + "false"
        );
    }
    getPricingStrategyList(type: string) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.PS_LIST + type);
    }

    getPurchaseOrderList(whId: number){
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.PO_LIST + whId);
    }

    getPurchaseComparision(poId: number){
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.PURCHASE_COMPARISION_LIST + poId);
    }
}