import { Injectable, EventEmitter } from '@angular/core';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { HttpClient } from '@angular/common/http';
import { ReqInvoice } from '../models/Invoices';
import { StorageConstants } from '../static/storage_constants';
import { DtStoreOfflineProduct } from '../models/products';

@Injectable({
    providedIn: 'root'
})
export class ServiceSync {

    invoiceSyncDataChanged = new EventEmitter<void>();

    constructor(private http: HttpClient) { }

    isInvoiceDataSynched(): boolean {
        let syncList = this.getInvoiceSyncList();
        if (syncList == null) {
            syncList = [];
            this.setInvoiceSyncList(syncList);
            return true;
        } else if (syncList.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    getNumberOfPendingInvoices(): number {
        let syncList = this.getInvoiceSyncList();
        return syncList.length;
    }

    setInvoiceSyncList(invoiceList: ReqInvoice[]) {
        localStorage.setItem(StorageConstants.SYNC_INVOICES, JSON.stringify(invoiceList));
    }

    getInvoiceSyncList(): ReqInvoice[] {
        let syncList: ReqInvoice[] = JSON.parse(localStorage.getItem(StorageConstants.SYNC_INVOICES));
        return syncList;
    }

    saveStoreProducts(items: DtStoreOfflineProduct[]) {
        let str = JSON.stringify(items);
        localStorage.setItem(StorageConstants.SYNC_ITEMS, str);
    }

    getStoreProductByBarcode(barcode: number): DtStoreOfflineProduct {
        let products: DtStoreOfflineProduct[] = JSON.parse(localStorage.getItem(StorageConstants.SYNC_ITEMS));
        let foundProduct: DtStoreOfflineProduct = null;
        products.forEach(
            (product) => {
                if (+product.barcode == barcode) {
                    foundProduct = product;
                }
            }
        );
        return foundProduct;
    }

    getAllSyncedProducts() {
        let products: DtStoreOfflineProduct[] = JSON.parse(localStorage.getItem(StorageConstants.SYNC_ITEMS));
        return products;
    }

    isStoreProductsDataLoaded() {
        if (localStorage.getItem(StorageConstants.SYNC_ITEMS)) {
            let products: DtStoreOfflineProduct[] = JSON.parse(localStorage.getItem(StorageConstants.SYNC_ITEMS));
            if (products.length == 0) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    addToInvoiceSyncList(invoiceRequest: ReqInvoice) {
        let syncList: ReqInvoice[] = this.getInvoiceSyncList();
        if (syncList == null) {
            syncList = [];
        }
        syncList.push(invoiceRequest);
        this.setInvoiceSyncList(syncList);
    }

    updateQuantityById(id: number, quantity: number) {
        let products: DtStoreOfflineProduct[] = JSON.parse(localStorage.getItem(StorageConstants.SYNC_ITEMS));
        products.forEach(
            (product) => {
                if (product.id == id) {
                    product.quantity -= quantity;
                }
            }
        );
        this.saveStoreProducts(products);
    }

    /* METHODS FOR FETCHING DATA FROM SERVER */
    getAllStoreProducts(storeId: number) {
        let store = {
            id: storeId
        }
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._SYNC_ITEMS.POST.ALL_STORE_ITEMS,
            {
                id: storeId
            }
        );
    }


}