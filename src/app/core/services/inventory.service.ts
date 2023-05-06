import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ServiceAuth } from './auth.service';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';
import { ApiConstants } from '../static/api_constants';
import { ReqStoreProductsUpdateList, ReqPasswordProductUpdate, ReqPasswordProductUpdateList, ModelStoreProductResponse, ModelConvertQuantity } from '../models/products';
import { ReqTransferProducts } from '../models/inventory';
 
@Injectable({
  providedIn: 'root'
})
export class ServiceInventory {

  storeProductsForLibraryItemUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private authService: ServiceAuth,
    private languageService: ServiceLanguage
  ) { }

  getBranchProducts(page: DtPage) {
    page.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.POST.STORE_PRODUCTS_LIST,
      page
    );
  }

  getSelectedBranchProducts(pageInfo: DtPage) {
    pageInfo.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.POST.STORE_PRODUCTS_LIST,
      pageInfo
    );
  }

  updateBranchProducts(request: ReqStoreProductsUpdateList) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._INVENTORY.PUT.UPDATE_STORE_PRODUCTS,
      request
    );
  }

  updateBranchProductProtected(request: ReqPasswordProductUpdate) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.UPDATE_BRANCH_PRODUCT,
      request
    );
  }

  updateBranchProductProtectedList(request: ReqPasswordProductUpdateList) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.UPDATE_BRANCH_PRODUCT,
      request
    );
  }

  updateItemConversion(request: ModelConvertQuantity){
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.CONVERT_QUANTITY,
     request
    );
    
  }

  //   addBranchProductsFromLibrary(request: ModelStoreProductsListRequest) {
  //     return this.http.post(
  //       AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.TRANSFER_PRODUCTS,
  //       request
  //     );
  //   }

  //   addSingleBranchProductFromLibrary(request: ModelTransfterStoreProductRequest) {
  //     return this.http.post(
  //       AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.TRANSFER_SINGLE_PRODUCT,
  //       request
  //     );
  //   }

  getStoreLibraryProductsId() {
    let id = this.authService.getBranchId();
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.GET.STORE_PRODUCTS_ALL + id
    );
  }

  getSelectedStoreLibraryProductsId(id: number) {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.GET.STORE_PRODUCTS_ALL + id
    );
  }

  getStoreProductsByLibraryId(id: number) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.POST.LIBRARY_ITEM_PRODUCTS,
      { id: id }
    );
  }

  getBranchLibraryItems(page: DtPage) {
    page.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.POST.STORE_LIBRARY_ITEMS,
      page
    )
  }

  transferProducts(request: ReqTransferProducts) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._INVENTORY.POST.TRANSFER_PRODUCTS,
      request
    );
  }

  updateProductQuantity(itemId: number, quantity: number, comments: string) {
    return this.http.post(
      AppConstants.SERVER_URL
      + ApiConstants._INVENTORY.POST.UPDATE_PRODUCT_QUANTITY
      + itemId + '/' + quantity,
      { comment: comments }
    )
  }

  getQuantityAmendReason() {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.GET.QUANTITY_AMEND_REASON
    );
  }

}
