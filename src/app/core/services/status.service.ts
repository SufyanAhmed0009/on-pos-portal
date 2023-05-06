import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceStatus {

  constructor(private http: HttpClient) { }


  getStatusList(type: String) {
    let data = {
      "metaLanguage": {
        "code": "LANG0001"
      },
      "type": type
    }
    return this.http.post(
      AppConstants.SERVER_URL
      + ApiConstants._STATUS.POST.DO_STATUS_LIST,
      data
    );
  }

}
