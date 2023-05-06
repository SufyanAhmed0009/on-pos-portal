import { Injectable } from '@angular/core';
import { DtStoreOfflineProduct } from '../models/products';
import { StorageConstants } from '../static/storage_constants';
import { HttpClient } from '@angular/common/http';
import { ServiceAuth } from './auth.service';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';

@Injectable({
    providedIn: 'root'
})
export class ServiceSyncProducts {

    private products: DtStoreOfflineProduct[];

    constructor(private http: HttpClient, private authService: ServiceAuth){
        this.products = [];
        this.loadProducts();
    }

    getProducts(){
        return this.products;
    }

    fetchProducts(){
        let request = this.http.post(
            AppConstants.SERVER_READONLY_URL + 
            ApiConstants._SYNC_ITEMS.POST.ALL_STORE_ITEMS,
            { id: this.authService.getBranchId() }
        );
        return request;
    }

    saveProducts(products: DtStoreOfflineProduct[]) {
        this.products = products;
        let str = JSON.stringify(products);
        localStorage.setItem(StorageConstants.SYNC_ITEMS, str);
    }

    private loadProducts(){
        let data = localStorage.getItem(StorageConstants.SYNC_ITEMS);
        if (data == null){
            this.products = [];
        } else {
            this.products = JSON.parse(data);
        }
    }

    getProductsByName(name: string){
        let products = this.products.filter(
            (item) => {
                return item.title.toLowerCase().includes(name.toLowerCase());
            }
        );
        return products.slice(0,10);
    }

    getProductByBarcode(barcode: string){
        let product = this.products.find((item) => item.barcode == barcode);
        return product;
    }

}