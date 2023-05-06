import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RespStoreProduct, RespStoreProductsList, RespWarehouseProductsList } from 'src/app/core/models/products';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';
import { RespStoreLibraryItemList, RespStoreLibraryItem } from 'src/app/core/models/inventory';

@Component({
  selector: 'product-find-selector',
  templateUrl: './product-find-selector.component.html',
  styleUrls: ['./product-find-selector.component.css']
})
export class ProductFindSelectorComponent implements OnInit {

  products: RespStoreLibraryItem[];
  inputControl: FormControl;

  @Input('storeId') storeId: number;
  @Input('warehouseId') warehouseId: number;
  @Output('selected') selected = new EventEmitter<RespStoreLibraryItem>();

  constructor(private selectorsService: ServiceSelectors) { }

  ngOnInit(): void {
    this.inputControl = new FormControl();
    this.inputControl.valueChanges.subscribe(
      (keyword: string) => {
        this.updateList(keyword);
      }
    );
  }

  updateList(keyword: string) {
    console.log(this.warehouseId);
      this.selectorsService.selectProducts(
        keyword,
        this.warehouseId
      ).subscribe(
        (response: RespStoreLibraryItemList) => {
          this.products = response.libraryItemList;
        }
      );
  }

  onProductSelected(title: string) {
    let product = this.products.find((item) => item.title == title);
    this.selected.emit(product);
    this.inputControl.setValue('');
    this.products = [];
  }

}
