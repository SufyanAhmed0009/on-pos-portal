import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RespStoreProduct, ReqPasswordWHProductUpdate } from 'src/app/core/models/products';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { DtStatus } from 'src/app/core/models/status';
import { ServiceWarehouseInventory } from 'src/app/core/services/warehouse-inventory.service';

@Component({
  selector: 'wh-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateWhProductComponent implements OnInit {

  updateForm: FormGroup;

  /* STRATEGY TYPES */
  strategyTypes: DtPricingStrategy[];

  /* STATUS LIST */
  statusList: DtStatus[] = [
    {
      id: 3,
      title: "Enabled",
      code: "STA003"
    },
    {
      id: 4,
      title: "Disabled",
      code: "STA004"
    },
  ];

  updating: boolean;

  /* REASON TYPE DROPDOWN */
  reasonTypeList: reasonTypeList[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: RespStoreProduct,
    private snackbarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<UpdateWhProductComponent>,
    private inventoryService: ServiceWarehouseInventory,
  ) { }

  ngOnInit(): void {
    this.strategyTypes = StatusConstants.PRICING_STRATEGY_LIST.filter(ps => ps.type === 'W');
    this.updateForm = new FormGroup({
      cost: new FormControl(this.product.cost, Validators.required),
      price: new FormControl(this.product.price, Validators.required),
      discountAmount: new FormControl(this.product.discountAmount, Validators.required),
      quantity: new FormControl(0, Validators.required),
      amendReason: new FormControl(null),
      minQuantity: new FormControl(0, [Validators.min(0)]),
      maxQuantity: new FormControl(0, [Validators.min(0)]),
      strategy: new FormControl(this.product.pricingStrategyId),
      password: new FormControl(null, Validators.required),
      comments: new FormControl(null, Validators.required),
      statusId: new FormControl(this.product.status.id, Validators.required),
      verified: new FormControl(this.product.verified)
    });

    /* NEGATIVE QUANTITY VALAIDATION */
    const reasonControl = this.updateForm.get('amendReason');
    this.updateForm.controls.quantity.valueChanges.subscribe(
      (value: number) => {
        if (value < 0) {
        reasonControl.setValidators([Validators.required]);
        } else {      
          reasonControl.clearValidators();
        }
        reasonControl.updateValueAndValidity();
      }
    );

    this.updateForm.controls.comments.disable();
    this.updateForm.controls.quantity.valueChanges.subscribe(
      (value: number) => {
        if (value < 0) {
          this.updateForm.controls.comments.enable();
        } else {
          this.updateForm.controls.comments.disable();
        }
      }
    );

    if (this.product.pricingStrategyId == 1 || this.product.pricingStrategyId == 2) {
      this.updateForm.controls.price.disable();
    }

    this.updateForm.controls.strategy.valueChanges.subscribe(
      (strategyId: number) => {
        if (strategyId == 1 || strategyId == 2) {
          this.updateForm.controls.price.disable();
        } else {
          this.updateForm.controls.price.enable();
        }
      }
    );

    this.inventoryService.getQuantityAmendReason().subscribe(
      (response: reasonTypeList[])=>{
        this.reasonTypeList = response;  
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    let password = this.updateForm.controls.password.value;
    if (password == '48oTTYKrmZYZ') {
      this.update();
    } else {
      this.snackbarService.showErrorMessage("Incorrect Password! Try again!");
    }
  }

  update() {

    let values: FormValues = this.updateForm.value;
    let request: ReqPasswordWHProductUpdate = {
      itemId: this.product.id,
      price: values.price,
      setPrice: false,
      cost: values.cost,
      quantity: values.quantity,
      quantityAmendReasonId: values.amendReason,
      minQuantity: values.minQuantity,
      maxQuantity: values.maxQuantity,
      strategyId: values.strategy,
      netSalePrice: values.price - values.discountAmount,
      storeDiscount: 0,
      onDiscount: 0,
      discountAmount: values.discountAmount,
      comments: values.comments ?? '',
      statusId: values.statusId,
      verified: values.verified
    }
    console.log(request);
    this.updating = true;
    this.inventoryService.updateWarehouseProductProtected(request).subscribe(
      (response) => {
        this.snackbarService.showSuccessMessage("Updated Succesfully!");
        this.dialogRef.close(true);
      },
      (error) => {
        console.error(error);
        this.snackbarService.showErrorMessage("Error Updating!");
        this.updating = false;
      }
    );

  }

  getNetSalePrice() {
    let price = this.updateForm.controls.price.value;
    let discountAmount = this.updateForm.controls.discountAmount.value;
    return price - discountAmount;
  }

}


class ProductType {
  id: number;
  title: string;
}

class FormValues {
  cost: number;
  price: number;
  discountAmount: number;
  quantity: number;
  amendReason?: number;
  minQuantity?: number;
  maxQuantity?: number;
  strategy: number;
  comments: string;
  statusId: number;
  verified: boolean;
}

class reasonTypeList {
  id: number;
  title: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}