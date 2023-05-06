import { Injectable, EventEmitter } from '@angular/core';
import { ReqInvoice } from '../models/Invoices';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceAuth } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceInvoice {

    resetRequest = new EventEmitter<void>();

    constructor(
        private http: HttpClient,
        private authService: ServiceAuth
    ) { }

    syncPendingInvoices(pendingInvoices: ReqInvoice[]) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._INVOICES.POST.SYNC_PENDING_INVOICES,
            pendingInvoices
        );
    }

    getInvoiceList(page: DtPage) {
        page.id = this.authService.getBranchId();
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._INVOICES.POST.INVOICES_LIST,
            page
        );
    }

}