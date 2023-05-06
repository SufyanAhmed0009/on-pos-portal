import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ServiceLanguage } from './language.service';
import { DtPage } from '../models/page';

@Injectable({
    providedIn: 'root'
})
export class ServiceSelectors {

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    selectStores(keyword: string, franchiseId: number) {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._SELECTORS.GET.STORES
            + keyword + '/' + franchiseId
        )
    }

    selectProducts(keyword: string, storeId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        let page: DtPage = {
            page: 0,
            size: 10, 
            title: keyword,
            id: storeId,
            languageId: langId
        }
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._LIBRARY_PRODUCT.POST.PRODUCTS_LIST,
            page
        );
    }

    selectProductByBarcode(barcode: string, warehouseId: number) {
        console.log(warehouseId);
        console.log(AppConstants.SERVER_READONLY_URL + ApiConstants._LIBRARY_PRODUCT.GET.BARCODE_SEARCH + barcode + ( warehouseId ? '/' + warehouseId : ''));
        return this.http.get(
            AppConstants.SERVER_READONLY_URL + ApiConstants._LIBRARY_PRODUCT.GET.BARCODE_SEARCH + barcode + ( warehouseId ? '/' + warehouseId : '')
        );
    }

    selectWarehouseProducts(keyword: string, warehouseId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        let page: DtPage = {
            page: 0,
            size: 10,
            title: keyword,
            id: warehouseId,
            languageId: langId
        }
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._LIBRARY_PRODUCT.POST.PRODUCTS_LIST,
            page
        );
    }

}