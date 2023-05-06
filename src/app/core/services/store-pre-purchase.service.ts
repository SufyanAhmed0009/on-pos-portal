import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { DtPage } from '../models/page';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { ServiceLanguage } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceStorePrePurchase {

  dataUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private languageService: ServiceLanguage
  ) { }

  uploadSheet(request: any) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._BRANCH_PRE_PURCHASES.POST.UPLOAD_SHEET,
      request
    );
  }

  getPurchaseList(page: DtPage) {
    page.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._BRANCH_PRE_PURCHASES.POST.PRE_PURCHASE_LIST,
      page
    );
  }

  getPurchaseInfo(purchaseId: number) {
    let langId = this.languageService.getCurrentLanguage().id;
    let url = AppConstants.SERVER_READONLY_URL +
      ApiConstants._BRANCH_PRE_PURCHASES.GET.PRE_PURCHASE_INFO + purchaseId + '/' + langId;
    console.log(url);
    return this.http.get(
      AppConstants.SERVER_READONLY_URL +
      ApiConstants._BRANCH_PRE_PURCHASES.GET.PRE_PURCHASE_INFO + purchaseId + '/' + langId
    );
  }
  
  onApprove(purchaseId: number, isApproved: number) {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL +
      ApiConstants._BRANCH_PRE_PURCHASES.GET.PRE_PURCHASE_APPROVE + purchaseId + '/' + isApproved
    );
  }

  onOpen(purchaseId: number, open: number) {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL +
      ApiConstants._BRANCH_PRE_PURCHASES.GET.PRE_PURCHASE_OPEN + purchaseId + '/' + open
    );
  }

}
