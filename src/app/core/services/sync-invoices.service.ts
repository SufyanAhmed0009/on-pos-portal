import { Injectable, EventEmitter } from '@angular/core';
import { ReqInvoice } from '../models/Invoices';
import { StorageConstants } from '../static/storage_constants';

@Injectable({
    providedIn: 'root'
})
export class ServiceSyncInvoices {

    invoiceAdded = new EventEmitter<void>();

    constructor() { }

    invoicesSynched(): boolean {
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

    getInvoiceSyncList(): ReqInvoice[] {
        let syncData = localStorage.getItem(StorageConstants.SYNC_INVOICES);
        if (syncData){
            let syncList: ReqInvoice[] = JSON.parse(syncData);
            return syncList;
        } else {
            return [];
        }
    }

    setInvoiceSyncList(invoiceList: ReqInvoice[]) {
        localStorage.setItem(StorageConstants.SYNC_INVOICES, JSON.stringify(invoiceList));
    }

    addToInvoiceSyncList(invoiceRequest: ReqInvoice) {
        let syncList: ReqInvoice[] = this.getInvoiceSyncList();
        if (syncList == null) {
            syncList = [];
        }
        syncList.push(invoiceRequest);
        this.setInvoiceSyncList(syncList);
    }

}