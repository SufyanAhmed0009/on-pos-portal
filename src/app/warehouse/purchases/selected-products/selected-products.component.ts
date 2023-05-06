import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DtPurchaseProduct } from 'src/app/core/models/products';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatTable } from '@angular/material/table';
import { DtSheetProduct } from 'src/app/core/models/sheet-product';

@Component({
  selector: 'wh-selected-products',
  templateUrl: './selected-products.component.html',
  styleUrls: ['./selected-products.component.css']
})
export class WhSelectedProductsComponent implements OnInit {

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
    console.log("this.products")
    console.log(this.products)

    this.pricingStategiesList = StatusConstants.PRICING_STRATEGY_LIST.filter(ps => ps.type === 'W');

  }

  getCost(id, perUnit) {
    let item = this.products.find(item => item.id == id);
    if(perUnit == null) {
      item.cost = item.itemCost / item.quantity;
      item.itemCost = item.cost * item.quantity;
    } else if(perUnit) {
      item.cost = item.itemCost / item.quantity;
    } else {
      item.itemCost = item.cost * item.quantity;
    }
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
        console.log("high")
        product.highCost = true; 
        product.lowCost = false;
      }
      else if (product.cost < low) {
        console.log("low")
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
