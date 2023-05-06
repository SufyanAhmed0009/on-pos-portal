import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DtOrdersPage } from '../models/page';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ServiceAuth } from './auth.service';
import { ReqUpdateOrderStatus } from '../models/orders';

@Injectable({
    providedIn: 'root'
})
export class ServiceOrders {

    dateUpdated = new EventEmitter<void>();

    constructor(
        private http: HttpClient,
        private authService: ServiceAuth
    ) { }

    getOrdersList(page: DtOrdersPage) {
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._ORDERS.POST.ORDERS_LIST,
            page
        );
    }

    getBranchOrdersList(page: DtOrdersPage){
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._ORDERS.POST.BRANCH_ORDERS_LIST,
            page
        );
    }

    getOrderDetails(id: number, branchId: number) {
        let request = {
            customerOrderId: id, 
            state: 'N',
            branchId: branchId
        }
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._ORDERS.POST.ORDER_DETAILS,
            request
        );
    }

    getOrdersHighlights(storeId: number){
        return this.http.get(
            AppConstants.SERVER_READONLY_URL 
            + ApiConstants._ORDERS.GET.BRANCH_ORDERS_HIGHLIGHTS
            + storeId
        )
    }

    makeOrderReady(request: ReqUpdateOrderStatus){
        return this.http.post(
            AppConstants.SERVER_URL
            + ApiConstants._ORDERS.POST.MAKE_READY,
            request
        )
    }

    dispatchOrder(request: ReqUpdateOrderStatus){
        return this.http.post(
            AppConstants.SERVER_URL
            + ApiConstants._ORDERS.POST.DISPATCH_ORDER,
            request
        )
    }

}