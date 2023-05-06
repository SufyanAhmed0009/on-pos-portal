import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { OrderRiderReportRequest } from '../models/rider-report';
@Injectable({
  providedIn: 'root'
})
export class RiderReportService {

  constructor(private http: HttpClient) { }

  getRiderReportList(branchId: number) {
    return this.http.get(
      AppConstants.SERVER_URL
      + ApiConstants._REPORTS.GET.ORDER_RIDER_REPORT
      + branchId
    );
  }

  getRiderInfoList(request: OrderRiderReportRequest) {
    return this.http.post(
      AppConstants.SERVER_URL
      + ApiConstants._REPORTS.POST.ORDER_RIDER_REPORT,
      request
    );
  }



}
