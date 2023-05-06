import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';

@Injectable({
    providedIn: 'root'
})
export class ServiceDashboard {

    constructor(private http: HttpClient) { }

    getDashboardFinanceData(branchId: number, start: string) {
        let filters = { start, branchId };
        return this.http.post(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._DASHBOARD.POST.BRANCH_FINANCE,
            filters
        );
    }

    getEnablerDailySummary(branchIds: number[], date: string) {
        let filters = { date, branchIds };
        return this.http.post(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._DASHBOARD.POST.DAILY_SUMMARY,
            filters
        );
    }

}