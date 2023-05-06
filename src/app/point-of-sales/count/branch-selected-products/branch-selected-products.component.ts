import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DtPurchaseProduct } from 'src/app/core/models/products';


@Component({
  selector: 'app-branch-selected-products',
  templateUrl: './branch-selected-products.component.html',
  styleUrls: ['./branch-selected-products.component.css']
})
export class BranchSelectedProductsComponent implements OnInit {

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
