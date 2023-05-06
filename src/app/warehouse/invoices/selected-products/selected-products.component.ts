import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DtPurchaseProduct } from 'src/app/core/models/products';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'wh-invoice-selected-products',
  templateUrl: './selected-products.component.html',
  styleUrls: ['./selected-products.component.css']
})
export class WhSelectedInvoiceProductsComponent implements OnInit {

  @Input('products') products: DtPurchaseProduct[];

  columnsList = [
    'name',
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

  constructor() { }

  ngOnInit(): void {
    this.pricingStategiesList = StatusConstants.PRICING_STRATEGY_LIST.filter(ps => ps.type === 'W');

  }

  quantityChanged(id) {
    let item = this.products.find(item => item.id == id);
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
    console.info(changes);
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
