import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelStoreProductResponse, RespWarehouseProduct } from 'src/app/core/models/products';
import { DtStatus } from 'src/app/core/models/status';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { ItemConversionComponent } from 'src/app/point-of-sales/inventory/item-conversion/item-conversion.component';
import { Direction } from '@angular/cdk/bidi/directionality';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'wh-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class WhProductsListComponent implements OnInit {

  @Input('products') products: RespWarehouseProduct[];
  @Output('reduceQuantity') reduceQuantity = new EventEmitter<RespWarehouseProduct>();
  @Output('updateProduct') updateProduct = new EventEmitter<RespWarehouseProduct>();

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

  columnsList = [
    // 'select',
    'id',
    'title',
    // 'type',
    'strategy',
    'price',
    'cost',
    'quantity',
    'minQuantity',
    'maxQuantity',
    'discount',
    'netSalePrice',
    'barcode',
    'status',
    'verified',
    'edit',
    'editItemConversion'
  ];

  constructor(private languageService: ServiceLanguage,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.strategyTypes = StatusConstants.PRICING_STRATEGY_LIST;
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

  getStrategyTitle(id: number){
    if (id){
      return this.strategyTypes.find((item) => item.id == id).description;
    } else {
      return 'NA';
    }
  }

  onUpdateProduct(product: RespWarehouseProduct){
    this.updateProduct.emit(product);
  }

  onReduceQuantity(product: RespWarehouseProduct){
    this.reduceQuantity.emit(product);
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

}

class ProductType {
  id: number;
  title: string;
}