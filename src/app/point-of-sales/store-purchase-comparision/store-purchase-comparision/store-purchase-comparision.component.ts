import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PurchasedAdditionally, StorePurchaseComparisionListResp } from 'src/app/core/models/purchase-comparision';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';

@Component({
  selector: 'app-store-purchase-comparision',
  templateUrl: './store-purchase-comparision.component.html',
  styleUrls: ['./store-purchase-comparision.component.css']
})
export class StorePurchaseComparisionComponent implements OnInit {

 /* LISTS */
 ApiResponse: StorePurchaseComparisionListResp;
 purchasedAdditionally: PurchasedAdditionally[] = [];
 nullQuantity: PurchasedAdditionally[] = [];
 fullyMatched: PurchasedAdditionally[] = [];
 notMatched: PurchasedAdditionally[] = [];
 notPurchased: PurchasedAdditionally[] = [];

 PurchaseOrderList: DtSelectItem[] = [];
 panelOpenState = false;
 isLoading: boolean = false;

selectedStore: number;

 /* SELECTED PRE PURCHASE ORDER */
 selectedPOId: number;
 POList: PrePurchaseOrder[];
 PONames: string[] = [];
 filteredPONames: Observable<string[]>;
 POControl: FormControl;

 /* MAT-TABLE */
 columnsList = [
   'libraryItemId',
   'title',
   'quantity',
 ];

 /* MAT-TABLE */
 notMatchedColumnsList = [
   'libraryItemId',
   'title',
   'quantity',
   'quantityDifference'
 ];

 constructor(
   private purchaseService: ServicePurchases,
   private authService: ServiceAuth,
   private spreadsheetService: ServiceSpreadsheet,
 ) { }

 ngOnInit(): void {
   this.selectedStore = this.authService.getBranchId();
   this.authService.storeChanged.subscribe(
     (store: DtSelectItem) => {
       console.log("store")
       console.log(store)
       this.selectedStore = store.id;
     }
   );

   // FOR PRE-PURCHASE ORDER FILTER.
   this.POControl = new FormControl();
   this.filteredPONames = this.POControl.valueChanges
     .pipe(
       startWith(''),
       map(value => this._filter(value))
     );

   this.isLoading = true;
  //  GET LIST OF PRE-PURCHASE ORDERS.
   this.purchaseService.getPurchaseOrderList(this.selectedStore).subscribe(
     (data: any[]) => {
       console.log(data)

       this.POList = data.map(
         (item) => {
           return {
             id: item.id,
             title: item.title,
           }
         }
       );
       this.PONames = this.POList.map(
         (item) => {
           return item.title;
         }
       );
       this.selectedPOId = this.POList[this.POList.length-1].id;
       this.POControl.setValue(this.POList[this.POList.length-1].title);

       //GET PURCHASE COMPARISION LIST.
       this.getPurchaseComparisionList();

     }
   );

 }

 getPODropDownList() {
   this.purchaseService.getPurchaseOrderList(this.selectedStore).subscribe(
     (response: DtSelectItem[]) => {
       console.log(response)
       this.PurchaseOrderList = response;
       this.selectedPOId = this.PurchaseOrderList[0].id;
       this.getPurchaseComparisionList();
     }
   )
 }

 getPurchaseComparisionList() {
   this.isLoading = true;
   this.purchaseService.getPurchaseComparision(this.selectedPOId).subscribe(
     (response: StorePurchaseComparisionListResp) => {
       console.log("response")
       console.log(response)
       this.ApiResponse = response;
       this.purchasedAdditionally = response.purchasedAdditionally;
       this.nullQuantity = response.nullQuantity;
       this.fullyMatched = response.fullyMatched;
       this.notMatched = response.notMatched;
       this.notPurchased = response.notPurchased;
       this.isLoading = false;
     }
   );
 }

 onPOChange(event) {
   this.selectedPOId = event.value;
   this.getPurchaseComparisionList();
 }


 /* ON SELECTING PRE PURCHASE ORDER */
 onPOSelected(name: string) {
   let purchaseOrder = this.POList.find(
     (item) => {
       return item.title == name;
     }
   );
   console.log(purchaseOrder);
   this.selectedPOId = purchaseOrder.id;
   this.getPurchaseComparisionList();
 }

 onPOCleared() {
   this.POControl.setValue('');
   this.selectedPOId = null;
 }

 private _filter(value: string): string[] {
   const filterValue = value.toLowerCase();
   return this.PONames.filter(option => option.toLowerCase().includes(filterValue));
 }

 /* ON DOWNLOAD */
 onDownload() {
   let comparisonArray: any[][] = [];
   comparisonArray.push([
     'Library Item Id',
     'Title',
     'Pre Quantity',
     'Purchased Quantity',
     'Quantity Difference'
   ]);
 
    // FULLY MATCHED LIST. 
   this.fullyMatched.forEach(
     (item) => {
       comparisonArray.push([
         item.libraryItemId,
         item.title,
         item.quantity,
         item.quantity
       ])
     }
   );
 
   // NOT MATCHED LIST. 
   this.notMatched.forEach(
     (item) => {
       comparisonArray.push([
         item.libraryItemId,
         item.title,
         item.quantity + Math.abs(item.quantityDifference),
         item.quantity,
         item.quantityDifference
       ])
     }
   );
  
   // NOT PURCHASED LIST. 
   this.notPurchased.forEach(
     (item) => {
       comparisonArray.push([
         item.libraryItemId,
         item.title,
         item.quantity,
         0
       ])
     }
   );
  
   // PURCHASED ADDITIONALLY LIST. 
   this.purchasedAdditionally.forEach(
     (item) => {
       comparisonArray.push([
         item.libraryItemId,
         item.title,
         0,
         item.quantity,
       ])
     }
   );
  
   if(this.nullQuantity.length > 0){
     
     // NULL QUANTITY LIST. 
     this.nullQuantity.forEach(
       (item) => {
         comparisonArray.push([
           item.libraryItemId,
           item.title,
           item.quantity,
         ])
       }
     );
    
   }

   this.spreadsheetService.exportArrayAsExcelFile(comparisonArray, 'Purchase-Comparision');
  
 }

}


class PrePurchaseOrder {
 id: number;
 title: string;
}
