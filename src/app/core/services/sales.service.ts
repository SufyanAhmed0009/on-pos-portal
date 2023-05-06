import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';

@Injectable({
    providedIn: 'root'
})
export class ServiceSales {
    

    constructor(private http: HttpClient) { }

    getDailySalesList(branchId: number) {
        return this.http.get(
            AppConstants.SERVER_URL
            + ApiConstants._SALES.GET.DAILY_BRANCH_SALES_LIST
            + branchId
        );
    }

    getAvailableInventory(branchId: number){
        return this.http.get(
            AppConstants.SERVER_URL
            + ApiConstants._SALES.GET.AVAILABLE_INVENTORY
            + branchId
        )
    }

    getPendingOrdersSales(branchId: number) {
        return this.http.get(
            AppConstants.SERVER_URL
            + ApiConstants._SALES.GET.PENDING_ORDERS_SALE
            + branchId
        )
      }

}