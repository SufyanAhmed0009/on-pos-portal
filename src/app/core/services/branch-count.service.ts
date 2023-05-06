import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { DtPage } from '../models/page';
import { ReqBranchCount } from '../models/purchases';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { ServiceLanguage } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class BranchCountService {

  dataUpdated = new EventEmitter<void>();
  warehouseSelected = new EventEmitter<number>();
  constructor(
    private http: HttpClient,
    private languageService: ServiceLanguage
  ) { }

  addNewCount(request: ReqBranchCount) {
    return this.http.post(
        AppConstants.SERVER_URL + ApiConstants._BRANCH_COUNT.POST.ADD_COUNT,
        request
    );
}

geCountList(page: DtPage) {
  page.languageId = this.languageService.getCurrentLanguage().id;
  return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._BRANCH_COUNT.POST.COUNT_LIST,
      page
  );
}

getCountInfo(countId: number) {
  let langId = this.languageService.getCurrentLanguage().id;
  let url = AppConstants.SERVER_READONLY_URL +
      ApiConstants._BRANCH_COUNT.GET.COUNT_INFO + countId + '/' + langId;
  console.log(url);
  return this.http.get(url);
}

// updateCount(request: ReqWarehouseSheetUpload) {
//   return this.http.put(
//       AppConstants.SERVER_URL + ApiConstants._WAREHOUSE_COUNT.PUT.UPDATE_COUNT,
//       request
//   );
// }

showTitle(){
  return this.http.get(
      AppConstants.SERVER_URL + ApiConstants._PURCHASES.GET.SHOW_TITLE + "false"
  );
}

onOpen(countId: number, open: number) {
  return this.http.get(
    AppConstants.SERVER_READONLY_URL +
    ApiConstants._BRANCH_COUNT.GET.COUNT_OPEN + countId + '/' + open
  );
}

}
