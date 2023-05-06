import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DtPurchaseProduct } from 'src/app/core/models/products';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'wh-count-selected-products',
  templateUrl: './selected-products.component.html',
  styleUrls: ['./selected-products.component.css']
})
export class WhCountSelectedProductsComponent implements OnInit {

  @Input('products') products: DtPurchaseProduct[];

  columnsList = [
    'name',
    'retailPrice',
    'quantity',
    'delete'
  ]

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor() { }

  ngOnInit(): void {
    console.log("this.products")
    console.log(this.products)
  }

  onRemoveItem(index: number) {
    this.products.splice(index, 1);
    this.table.renderRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.info(changes);
  }
}
