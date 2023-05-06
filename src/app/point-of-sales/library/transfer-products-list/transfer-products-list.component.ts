import { Component, OnInit, Input } from '@angular/core';
import { DtTransferProduct } from 'src/app/core/models/inventory';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';

@Component({
  selector: 'transfer-products-list',
  templateUrl: './transfer-products-list.component.html',
  styleUrls: ['./transfer-products-list.component.css']
})
export class TransferProductsListComponent implements OnInit {

  @Input('products') products: DtTransferProduct[];

  /* PRODUCT TYPES */
  productTypes: ProductType[] = [
    { id: 1, title: 'Physical' },
    { id: 2, title: 'Virtual' }
  ]

  /* STRATEGY TYPES */
  strategyTypes: DtPricingStrategy[];

  columnsList = [
    'select',
    'id',
    'title',
    'type',
    'strategy',
    'price'
  ]

  constructor() { }

  ngOnInit(): void {

    this.strategyTypes = StatusConstants.PRICING_STRATEGY_LIST;

  }

}

class ProductType {
  id: number;
  title: string;
}
