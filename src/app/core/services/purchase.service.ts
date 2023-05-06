import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReqPurchase } from '../models/purchases';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { ReqSheetUpload } from '../models/sheet-product';

@Injectable({
    providedIn: 'root'
})
export class ServicePurchases {

    dataUpdated = new EventEmitter<void>();
    supplierSelected = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    addNewPurchase(request: ReqPurchase) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.ADD_PURCHASE,
            request
        );
    }

    getPurchaseList(page: DtPage) {
        page.languageId = this.languageService.getCurrentLanguage().id;
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._PURCHASES.POST.PURCHASE_LIST,
            page
        );
    }

    getPurchaseInfo(purchaseId: number) {
        let whId = 1;
        let langId = this.languageService.getCurrentLanguage().id;
        let url = AppConstants.SERVER_READONLY_URL +
            ApiConstants._PURCHASES.GET.PURCHASE_INFO + purchaseId + '/' + langId +'/'+ whId;
        console.log(url);
        return this.http.get(
            AppConstants.SERVER_READONLY_URL +
            ApiConstants._PURCHASES.GET.PURCHASE_INFO + purchaseId + '/' + langId + '/'+ whId
        );
    }

    uploadSheet(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.UPLOAD_SHEET,
            request
        );
    }

    confirmSheetUpload(purchaseId: number, whId: number) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.CONFIRM_UPLOAD_SHEET,
            { branchPurchaseId: purchaseId, approve: true, whId: whId }
        );
    }

    updateInventory(request: ReqSheetUpload) {
        return this.http.put(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.PUT.UPDATE_INVENTORY,
            request
        );
    }

    getListOfWh() {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.WH_LIST);
    }

    showTitle() {
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.SHOW_TITLE + "false"
        );
    }

    getPricingStrategyList(type: string) {
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.PS_LIST + type);
    }

    getPurchaseOrderList(branchId: number){
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.PO_LIST + branchId);
    }

    getPurchaseComparision(poId: number){
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.PURCHASE_COMPARISION_LIST + poId);
    }

    getDisputeReasons(){
        return this.http.get(AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.DISPUTE_REASON_LIST);
    }
}