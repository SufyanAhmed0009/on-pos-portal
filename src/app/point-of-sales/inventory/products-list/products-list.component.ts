import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelConvertQuantity, ModelStoreProductResponse, RespStoreProduct } from 'src/app/core/models/products';
import { DtStatus } from 'src/app/core/models/status';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemHistoryComponent } from '../item-history/item-history.component';
import { Direction } from '@angular/cdk/bidi';
import { RespItemHistory, ReqItemHistory } from 'src/app/core/models/item-history';
import { ItemConversionComponent } from '../item-conversion/item-conversion.component';
import { ServiceAuth } from 'src/app/core/services/auth.service';


@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  @Input('products') products: RespStoreProduct[];
  @Output('reduceQuantity') reduceQuantity = new EventEmitter<RespStoreProduct>();
  @Output('updateProduct') updateProduct = new EventEmitter<RespStoreProduct>();

  /* PRODUCT TYPES */
  productTypes: ProductType[] = [
    { id: 1, title: 'Physical' },
    { id: 2, title: 'Virtual' }
  ]

  /* STATUS LIST */
  statusList: DtStatus[] = [
    { id: 3, title: "Enabled", code: "STA003" },
    { id: 4, title: "Disabled", code: "STA004" },
  ]

  /* STRATEGY TYPES */
  strategyTypes: DtPricingStrategy[];


  /* RIGHTS */
  userTypeList: number[] = [];
  isAllowedItemConversion: boolean = false;
  isAllowedEdit: boolean = false;

  superOwner: boolean = false;
  nonEnablerOwner: boolean = false;

  columnsList = [
    // 'select',
    'id',
    'title',
    'type',
    'strategy',
    'price',
    'cost',
    'quantity',
    'minQuantity',
    'maxQuantity',
    'discount',
    'quantityPerItem',
    'quantityPerOrder',
    'netSalePrice',
    'barcode',
    'status',
    'verified',
    'edit',
    'editItemConversion'
  ];

  constructor(
    private languageService: ServiceLanguage,
    private authService: ServiceAuth,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.strategyTypes = StatusConstants.PRICING_STRATEGY_LIST;

    // 26 IS SUPER OWNER
    // 31 IS NON-ENABLER OWNER
    this.userTypeList = this.authService.getUserTypeList();
    // this.isAllowedItemConversion = this.userTypeList.includes(31);
    this.isAllowedItemConversion = this.userTypeList.includes(26);
    this.isAllowedEdit = this.userTypeList.includes(26) || this.userTypeList.includes(31);
    // this.isAllowedEdit = this.userTypeList.includes(26);
    this.nonEnablerOwner = this.userTypeList.includes(31);
  }

  openImageModal(url: string) {

  }

  getType(inventoryId: number) {
    if (!inventoryId) {
      return 'NA'
    } else if (inventoryId == 1) {
      return 'Physical'
    } else {
      return 'Virtual'
    }
  }

  getStrategyTitle(id: number) {
    if (id) {
      return this.strategyTypes.find((item) => item.id == id).description;
    } else {
      return 'NA';
    }
  }

  onUpdateProduct(product: RespStoreProduct) {
    this.updateProduct.emit(product);
  }

  onReduceQuantity(product: RespStoreProduct) {
    this.reduceQuantity.emit(product);
  }


  onSelectItem(item: RespItemHistory) {
    this.matDialog.open(ItemHistoryComponent, {
      width: '900px',
      data: {
        id: item.id,
        range: 10,
        dateTime: new Date
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onUpdateItemConversion(item: ModelStoreProductResponse) {
    this.matDialog.open(ItemConversionComponent, {
      width: '500px',
      data: item,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }


  getDisplayedColumns() {
    this.columnsList = [
      'id', 'title', 'strategy', 'price', 'cost', 'quantity', 'minQuantity', 'maxQuantity',
      'discount', 'quantityPerItem', 'quantityPerOrder', 'netSalePrice', 'barcode', 'status'
    ];
    if (this.isAllowedItemConversion) { this.columnsList.push("editItemConversion"); }
    if (this.isAllowedEdit) { this.columnsList.push("edit"); }
    /* "strategy" */
    if (this.nonEnablerOwner) { this.columnsList.splice(2, 1) }
    /* "quantity", "minQuantity", "maxQuantity" */
    if (this.nonEnablerOwner) { this.columnsList.splice(4, 3) }
    /* "quantityPerItem", "quantityPerOrder"*/
    if (this.nonEnablerOwner) { this.columnsList.splice(5, 2) }
    return this.columnsList;
  }

}

class ProductType {
  id: number;
  title: string;
}