import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReqWarehouseCount } from '../models/purchases';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { ReqWarehouseSheetUpload } from '../models/sheet-product';

@Injectable({
    providedIn: 'root'
})
export class ServiceWarehouseCount {

    dataUpdated = new EventEmitter<void>();
    warehouseSelected = new EventEmitter<number>();

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    addNewCount(request: ReqWarehouseCount) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_COUNT.POST.ADD_COUNT,
            request
        );
    }

    geCountList(page: DtPage) {
        page.languageId = this.languageService.getCurrentLanguage().id;
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_COUNT.POST.COUNT_LIST,
            page
        );
    }

    getCountInfo(countId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        let url = AppConstants.SERVER_READONLY_URL +
            ApiConstants._WAREHOUSE_COUNT.GET.COUNT_INFO + countId + '/' + langId;
        console.log(url);
        return this.http.get(url);
    }

    updateCount(request: ReqWarehouseSheetUpload) {
        return this.http.put(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_COUNT.PUT.UPDATE_COUNT,
            request
        );
    }

    showTitle(){
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_PURCHASES.GET.SHOW_TITLE + "false"
        );
    }
 
    onOpen(countId: number, open: number) {
        return this.http.get(
          AppConstants.SERVER_READONLY_URL +
          ApiConstants._WAREHOUSE_COUNT.GET.COUNT_OPEN + countId + '/' + open
        );
      }

}