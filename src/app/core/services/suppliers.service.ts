import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';

@Injectable({
    providedIn: 'root'
})
export class ServiceWarehouseSuppliers {

    constructor(private http: HttpClient) { }

    getListOfAllSuppliers(){
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._WAREHOUSE_SUPPLIERS.GET.SUPPLIERS_LIST
        );
    }

    getListOfAllCustomers(){
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._WAREHOUSE_SUPPLIERS.GET.CUSTOMERS_LIST
        );
    }

}