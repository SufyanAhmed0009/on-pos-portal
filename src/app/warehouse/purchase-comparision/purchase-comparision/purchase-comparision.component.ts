import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PurchasedAdditionally, WhPurchaseComparisionListResp } from 'src/app/core/models/purchase-comparision';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { DtPurchaseOrder } from '../../purchases/manage-purchases/manage-purchases.component';

@Component({
  selector: 'purchase-comparision',
  templateUrl: './purchase-comparision.component.html',
  styleUrls: ['./purchase-comparision.component.css']
})
export class WhPurchaseComparisionComponent implements OnInit {

  /* LISTS */
  ApiResponse: WhPurchaseComparisionListResp;
  purchasedAdditionally: PurchasedAdditionally[] = [];
  nullQuantity: PurchasedAdditionally[] = [];
  fullyMatched: PurchasedAdditionally[] = [];
  notMatched: PurchasedAdditionally[] = [];
  notPurchased: PurchasedAdditionally[] = [];

  PurchaseOrderList: DtPurchaseOrder[] = [];
  panelOpenState = false;
  isLoading: boolean = false;

  selectedWarehouse: number;

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
    private purchaseService: ServiceWarehousePurchases,
    private authService: ServiceAuth,
    private spreadsheetService: ServiceSpreadsheet,
  ) { }

  ngOnInit(): void {
    this.selectedWarehouse = this.authService.getBranchId();
    this.authService.storeChanged.subscribe(
      (warehouse: DtSelectItem) => {
        this.selectedWarehouse = warehouse.id;
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
    // GET LIST OF PRE-PURCHASE ORDERS.
    this.purchaseService.getPurchaseOrderList(this.selectedWarehouse).subscribe(
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
    this.purchaseService.getPurchaseOrderList(this.selectedWarehouse).subscribe(
      (response: DtPurchaseOrder[]) => {
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
      (response: WhPurchaseComparisionListResp) => {
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
    // comparisonArray.push([ "FULLY MATCHED" ])
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
  
    // comparisonArray.push([]);
    // comparisonArray.push(["*******************************"]);
    // comparisonArray.push([ "NOT MATCHED" ])
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
    // comparisonArray.push([]);

    // comparisonArray.push(["*******************************"]);
    // comparisonArray.push([ "NOT PURCHASED" ])
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
    // comparisonArray.push([]);

    // comparisonArray.push(["*******************************"]);
    // comparisonArray.push([ "PURCHASED ADDITIONALLY" ])
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
    // comparisonArray.push([]);

    if(this.nullQuantity.length > 0){
      // comparisonArray.push(["*******************************"]);
      // comparisonArray.push([ "NULL QUANTITY" ])
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
      // comparisonArray.push([]);
    }

    this.spreadsheetService.exportArrayAsExcelFile(comparisonArray, 'Purchase-Comparision');
   
  }

}


class PrePurchaseOrder {
  id: number;
  title: string;
}
