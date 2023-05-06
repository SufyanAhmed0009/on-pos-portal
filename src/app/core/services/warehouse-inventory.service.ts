import { EventEmitter, Injectable } from '@angular/core';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ReqWarehouseProductsUpdateList, ReqPasswordWHProductUpdate, ModelConvertQuantity } from '../models/products';
import { ServiceAuth } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceWarehouseInventory {

  constructor(
    private http: HttpClient,
    private languageService: ServiceLanguage,
    private authService: ServiceAuth
  ) { }

  whProductsForLibraryItemUpdated = new EventEmitter<void>();

  getWarehouseProducts(page: DtPage) {
    page.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL +
      ApiConstants._WAREHOUSE_INVENTORY.POST.WAREHOUSE_PRODUCTS_LIST,
      page
    );
  }

  updateWarehouseProducts(request: ReqWarehouseProductsUpdateList) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVENTORY.PUT.UPDATE_WAREHOUSE_PRODUCTS,
      request
    );
  }

  updateWarehouseProductProtected(request: ReqPasswordWHProductUpdate) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVENTORY.POST.UPDATE_WAREHOUSE_PRODUCT,
      request
    );
  }

  getStoreInventorySummary() {
    let id = this.authService.getBranchId();
    console.log(id);
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_INVENTORY.GET.WAREHOUSE_INVENTORY_SUMMARY + id
    );
  }

  getQuantityAmendReason() {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_INVENTORY.GET.QUANTITY_AMEND_REASON
    );
  }

  downloadWhInventory(page: DtPage) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._WAREHOUSE_INVENTORY.POST.DOWNLOAD_WAREHOUSE_INVENTORY,
      page, { responseType: 'blob' }
    );
  }

  updateItemConversion(request: ModelConvertQuantity){
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_INVENTORY.POST.CONVERT_QUANTITY,
     request
    );
    
  }
}