import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RespStoreLibraryItem, RespStoreLibraryItemList } from 'src/app/core/models/inventory';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceAudio } from 'src/app/core/services/audio.service';

@Component({
  selector: 'product-barcode-find-selector',
  templateUrl: './product-barcode-find-selector.component.html',
  styleUrls: ['./product-barcode-find-selector.component.css']
})
export class ProductBarcodeFindSelectorComponent implements OnInit {

  barcodeForm: FormGroup;
  @Input('warehouseId') warehouseId: number;
  @Output('selected') selected = new EventEmitter<RespStoreLibraryItem>();

  constructor(
    private selectorsService: ServiceSelectors,
    private snackbarService: ServiceSnackbar,
    private audioService: ServiceAudio
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit(): void {

    this.barcodeForm = new FormGroup({
      barcode: new FormControl('')
    });

  }

  onSubmit() {
    let barcode = this.barcodeForm.value.barcode;
    this.selectorsService.selectProductByBarcode(
      barcode, this.warehouseId
    ).subscribe(
      (response: RespStoreLibraryItem) => {
        if (response && response?.id) {
          this.audioService.playBarcodeSound();
          response.totalQuantity = response.quantity;
          console.log(response)
          this.selected.emit(response);
        } else {
          this.audioService.playErrorSound();
          this.snackbarService.showErrorMessage("Not found!");
        }
        this.barcodeForm.controls.barcode.setValue('');
      }
    );
  }

}
