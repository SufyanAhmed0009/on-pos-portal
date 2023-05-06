import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DtPurchaseProduct } from 'src/app/core/models/products';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatTable } from '@angular/material/table';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'selected-products',
  templateUrl: './selected-products.component.html',
  styleUrls: ['./selected-products.component.css']
})
export class SelectedProductsComponent implements OnInit {

  @Input('products') products: DtPurchaseProduct[];
  supplierId: number;
  warehouseId: number;

  columnsList = [
    'name',
    'whCost',
    'retailPrice',
    'quantity',
    'cost',
    'costTotal',
    'delete'
    // 'pricingStrategy',
    // 'price'
  ]

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  pricingStategiesList: DtPricingStrategy[];

  constructor(
    private purchaseService: ServicePurchases,
    private warehousePurchaseService: ServiceWarehousePurchases,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {
    this.pricingStategiesList = StatusConstants.PRICING_STRATEGY_LIST.filter(ps => ps.type === 'S');
    /* SERVICE CALL FOR SUPPLIER ID */
    this.purchaseService.supplierSelected.subscribe(
      (supplierId: number) => {
        this.supplierId = supplierId;
      }
    );
    /* SERVICE CALL FOR WAREHOUSE ID */
    this.warehousePurchaseService.warehouseSelected.subscribe(
      (warehouseId: number) => {
        this.warehouseId = warehouseId;
      }
    );
  }

  getCost(id) {
    let item = this.products.find(item => item.id == id);
    if(item.quantity > (item.totalQuantity - item.unapprovedQuantity)) {
      item.quantity = item.totalQuantity - item.unapprovedQuantity;
      this.snackbarService.showErrorMessage("Max limit reached. Total quantity in Warehouse: "+ (item.totalQuantity - item.unapprovedQuantity));
    }

    item.itemCost = item.cost * item.quantity;
  }

  getTotalCost() {
    let sum = 0;
    this.products.forEach(
      (item) => {
        sum += (item.cost * item.quantity);
      }
    )
    return sum;
  }

  onRemoveItem(index: number) {
    this.products.splice(index, 1);
    this.table.renderRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.supplierId = changes?.supplierId?.currentValue;
    // this.warehouseId = changes?.warehouseId?.currentValue;
  }

  priceCheck(product: DtPurchaseProduct) {
    if (product.retailPrice && product.cost) {
      let rtPricePercent = product.retailPrice * 20 / 100;
      let high = product.retailPrice + rtPricePercent;
      let low = product.retailPrice - rtPricePercent;
      if (product.cost > high) {
        product.highCost = true;
        product.lowCost = false;
      }
      else if (product.cost < low) {
        product.lowCost = true;
        product.highCost = false;
      }
      else {
        product.highCost = false;
        product.lowCost = false;
      }
    }
    return product;
  }
}
