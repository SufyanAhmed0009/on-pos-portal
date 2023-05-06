import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModelConvertQuantity, ModelStoreProductResponse } from 'src/app/core/models/products';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceWarehouseInventory } from 'src/app/core/services/warehouse-inventory.service';

@Component({
  selector: 'app-item-conversion',
  templateUrl: './item-conversion.component.html',
  styleUrls: ['./item-conversion.component.css']
})
export class ItemConversionComponent implements OnInit {

  updateForm: FormGroup;
  submitting: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: ModelStoreProductResponse,
    private snackbarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<ItemConversionComponent>,
    private inventoryService: ServiceInventory,
    private whInventoryService: ServiceWarehouseInventory,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {

    this.updateForm = new FormGroup({
      quantity: new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),


    })
    console.log("this.product");
    console.log(this.product);
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {

    let password = this.updateForm.controls.password.value;
    if (password == '48oTTYKrmZ') {
      this.update();
    } else {
      this.snackbarService.showErrorMessage("Incorrect Password! Try again!");
    }
  }
  update() {
    this.submitting = true;
    let formvalue: { quantity: number } = this.updateForm.value;
    let request: ModelConvertQuantity;
    if (this.authService.getPortalType() == 's') {
      request = {
        branchId: this.product.branchId,
        quantity: formvalue.quantity,
        libItemId: this.product.libItemId,
        id: this.product.id,
      }

      this.inventoryService.updateItemConversion(request).subscribe(
        (response: any) => {
          if (response.type == "Error") {
            this.snackbarService.showErrorMessage(response.message)
          }
          else { this.snackbarService.showSuccessMessage("Updated Succesfully!"); }
          this.inventoryService.storeProductsForLibraryItemUpdated.emit();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error(error);
          this.snackbarService.showErrorMessage("Error Updating!");
          this.submitting = false;
        }
      );
    }
    else {
      request = {
        whId: this.authService.getBranchId(),
        quantity: formvalue.quantity,
        libItemId: this.product.libItemId,
        id: this.product.id,
      }

      this.whInventoryService.updateItemConversion(request).subscribe(
        (response: any) => {
          if (response.type == "Error") {
            this.snackbarService.showErrorMessage(response.message)
          }
          else { this.snackbarService.showSuccessMessage("Updated Succesfully!"); }
          this.whInventoryService.whProductsForLibraryItemUpdated.emit();
          this.dialogRef.close(true);
        },
        (error) => {
          console.error(error);
          this.snackbarService.showErrorMessage("Error Updating!");
          this.submitting = false;
        }
      );
    }
  }

}


