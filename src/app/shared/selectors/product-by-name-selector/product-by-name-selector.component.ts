import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DtStoreOfflineProduct } from 'src/app/core/models/products';
import { ServiceSyncProducts } from 'src/app/core/services/sync-products.service';

@Component({
  selector: 'product-by-name-selector',
  templateUrl: './product-by-name-selector.component.html',
  styleUrls: ['./product-by-name-selector.component.css']
})
export class ProductByNameSelectorComponent implements OnInit {

  products: DtStoreOfflineProduct[];
  inputControl: FormControl;
  @Output('selected') selected = new EventEmitter<DtStoreOfflineProduct>();

  constructor(private syncProductsService: ServiceSyncProducts) { }

  ngOnInit(): void {

    this.products = [];
    this.inputControl = new FormControl('');
    this.inputControl.valueChanges.subscribe(
      (value) => {
        this.products = this.syncProductsService.getProductsByName(value);
      }
    );

  }

  onProductSelected(title: string){
    let product = this.products.find((item) => item.title == title);
    this.selected.emit(product);
    this.inputControl.setValue('');
  }

}
