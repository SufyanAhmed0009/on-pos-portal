import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RespStoreProduct } from 'src/app/core/models/products';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-update-quantity',
  templateUrl: './update-quantity.component.html',
  styleUrls: ['./update-quantity.component.css']
})
export class UpdateQuantityComponent implements OnInit {

  updateForm: FormGroup;
  submitting: boolean;

  constructor(
    private dialogRef: MatDialogRef<UpdateQuantityComponent>,
    @Inject(MAT_DIALOG_DATA) public product: RespStoreProduct,
    private inventoryService: ServiceInventory,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {

    this.updateForm = new FormGroup({
      quantity: new FormControl(this.product.quantity, [Validators.required]),
      comments: new FormControl(null, Validators.required)
    })

  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitting = true;
    let formValue: { quantity: number, comments: string } = this.updateForm.value;
    this.inventoryService.updateProductQuantity(
      this.product.id, formValue.quantity, formValue.comments
    ).subscribe(
      (response) => {
        this.snackbarService.showSuccessMessage("Successfully Updated!");
        this.dialogRef.close(true);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating!");
      }
    );
  }

}
