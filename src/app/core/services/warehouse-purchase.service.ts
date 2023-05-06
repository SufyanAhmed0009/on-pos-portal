import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReqWarehousePurchase } from '../models/purchases';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { ReqWarehouseSheetUpload } from '../models/sheet-product';

@Injectable({
    providedIn: 'root'
})
export class ServiceWarehousePurchases {

    dataUpdated = new EventEmitter<void>();
    warehouseSelected = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    addNewPurchase(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.ADD_PURCHASE,
            request
        );
    }

    getPurchaseList(page: DtPage) {
        page.languageId = this.languageService.getCurrentLanguage().id;
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.PURCHASE_LIST,
            page
        );
    }

    getPurchaseInfo(purchaseId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        let url = AppConstants.SERVER_READONLY_URL +
            ApiConstants._WAREHOUSE_PURCHASES.GET.PURCHASE_INFO + purchaseId + '/' + langId;
        console.log(url);
        return this.http.get(
            AppConstants.SERVER_READONLY_URL +
            ApiConstants._WAREHOUSE_PURCHASES.GET.PURCHASE_INFO + purchaseId + '/' + langId
        );
    }

    uploadSheet(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.UPLOAD_SHEET,
            request
        );
    }

    confirmSheetUpload(purchaseId: number) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.CONFIRM_UPLOAD_SHEET,
            { whPurchaseId: purchaseId, approve: true }
        );
    }

    // updateInventory(request: ReqWarehouseSheetUpload) {
    updateInventory(request: any) {
        return this.http.put(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.PUT.UPDATE_INVENTORY,
            request
        );
    }
  
    updateInventoryNew(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.POST.UPDATE_INVENTORY,
            request
        );
    }

    showTitle() {
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.SHOW_TITLE + "false"
        );
    }
    getPricingStrategyList(type: string) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.PS_LIST + type);
    }

    getPurchaseOrderList(whId: number) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.PO_LIST + whId);
    }

    getPurchaseComparision(poId: number) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.PURCHASE_COMPARISION_LIST + poId);
    }

    getFileAttachmentDetails(transactionId: number) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.FILE_ATTACHMENTS + transactionId);
    }

    downloadFileAttachment(fileId: number) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.DOWNLOAD_FILE_ATTACHMENTS 
            + fileId, { responseType: 'blob' } );
    }

    deleteFileAttachment(fileId: number) {
        return this.http.delete(AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.DELETE.DELETE_FILE_ATTACHMENTS + fileId);
    }
}