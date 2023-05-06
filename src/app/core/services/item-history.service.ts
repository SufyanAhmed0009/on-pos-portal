import { Injectable } from '@angular/core';
import { AppConstants } from '../static/app-constants';
import { HttpClient } from '@angular/common/http';
import { ServiceLanguage } from './language.service';
import { ApiConstants } from '../static/api_constants';
import { ReqItemHistory } from '../models/item-history';

@Injectable({
  providedIn: 'root'
})
export class ItemHistoryService {

  constructor( private http: HttpClient,
    private languageService: ServiceLanguage,
    ) { }

  itemHistoryList(request: ReqItemHistory) {
    return this.http.post(
      AppConstants.SERVER_URL + 
      ApiConstants._INVENTORY.POST.ITEM_HISTORY_LIST,
      request   
    );
  }

  itemHistoryListByDate(request: ReqItemHistory) {
    return this.http.post(
      AppConstants.SERVER_URL + 
      ApiConstants._INVENTORY.POST.ITEM_HISTORY_LIST_DATE,
      request   
    );
  }

}
