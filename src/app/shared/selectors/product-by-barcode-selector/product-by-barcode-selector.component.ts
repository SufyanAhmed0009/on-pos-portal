import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DtStoreOfflineProduct } from 'src/app/core/models/products';
import { ServiceSyncProducts } from 'src/app/core/services/sync-products.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'product-by-barcode-selector',
  templateUrl: './product-by-barcode-selector.component.html',
  styleUrls: ['./product-by-barcode-selector.component.css']
})
export class ProductByBarcodeSelectorComponent implements OnInit {

  barcodeForm: FormGroup;

  @Output('selected') selected = new EventEmitter<DtStoreOfflineProduct>();

  constructor(private syncProductsService: ServiceSyncProducts) { }

  ngOnInit(): void {
    
    this.barcodeForm = new FormGroup({
      barcode: new FormControl('')
    });
    
  }

  onSubmitBarcode(){
    let barcode: string = this.barcodeForm.value.barcode;
    let product = this.syncProductsService.getProductByBarcode(barcode);
    if (product){
      this.selected.emit(product);
      this.barcodeForm.controls.barcode.setValue('');
    }
  }

}
