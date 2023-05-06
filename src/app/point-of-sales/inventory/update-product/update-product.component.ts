import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RespStoreProduct, ReqStoreProductsUpdateList, ReqPasswordProductUpdate } from 'src/app/core/models/products';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { DtStatus } from 'src/app/core/models/status';
import { ServiceAuth } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

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
  nonEnablerOwner: boolean = false;
  col: string = 'col-6';

  /* REASON TYPE DROPDOWN */
  reasonTypeList: reasonTypeList[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: RespStoreProduct,
    private snackbarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<UpdateProductComponent>,
    private inventoryService: ServiceInventory,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {
    console.log("this.product")
    console.log(this.product)
    this.strategyTypes = StatusConstants.PRICING_STRATEGY_LIST.filter(ps => ps.type === 'S');
    this.nonEnablerOwner = this.authService.getUserTypeList().includes(31);
    if(this.nonEnablerOwner){
      this.col = 'col-12';
    }
    this.updateForm = new FormGroup({
      cost: new FormControl(this.product.cost, Validators.required),
      price: new FormControl(this.product.price, Validators.required),
      storeDiscount: new FormControl(this.product.storeDiscount),
      ONDiscount: new FormControl(this.product.octoberDiscount),
      discountAmount: new FormControl(this.product.discountAmount, Validators.required),
      quantityPerItem: new FormControl(0, this.product.discountAmount > 0 && !this.nonEnablerOwner ? Validators.required : null),
      quantityPerOrder: new FormControl(0, this.product.discountAmount > 0 && !this.nonEnablerOwner ? Validators.required : null),
      quantity: new FormControl(0, !this.nonEnablerOwner ? Validators.required : null),
      amendReason: new FormControl(null),
      minQuantity: new FormControl(null, [Validators.min(0)]),
      maxQuantity: new FormControl(null, [Validators.min(0)]),
      // minQuantity: new FormControl(null, [!this.nonEnablerOwner ? Validators.min(0) : null]),
      // maxQuantity: new FormControl(null, [!this.nonEnablerOwner ? Validators.min(0) : null]),
      strategy: new FormControl(this.product.pricingStrategyId),
      password: new FormControl(null, !this.nonEnablerOwner ? Validators.required : null),
      comments: new FormControl(null, !this.nonEnablerOwner ? Validators.required : null),
      statusId: new FormControl(this.product.status.id, Validators.required),
      verified: new FormControl(this.product.verified)
    });

    /* DISCOUNT AMOUNT VALIDATION */
    const quantityPerItemControl = this.updateForm.get('quantityPerItem');
    const quantityPerOrderControl = this.updateForm.get('quantityPerOrder');
    this.updateForm.controls.discountAmount.valueChanges.subscribe(
      (value: number) => {
        if (value > 0) {
          quantityPerItemControl.setValidators([Validators.required]);
          quantityPerOrderControl.setValidators([Validators.required]);
        } else {
          quantityPerItemControl.clearValidators();
          quantityPerOrderControl.clearValidators();
        }
        quantityPerItemControl.updateValueAndValidity();
        quantityPerOrderControl.updateValueAndValidity();
      }
    );
    /* NEGATIVE QUANTITY VALIDATION */
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

    // this.updateForm.controls.comments.disable();
    // this.updateForm.controls.quantity.valueChanges.subscribe(
    //   (value: number) => {
    //     if (value < 0) {
    //       this.updateForm.controls.comments.enable();
    //     } else {
    //       this.updateForm.controls.comments.disable();
    //     }
    //   }
    // );

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
      (response: reasonTypeList[]) => {
        this.reasonTypeList = response;
        this.updateForm.controls.amendReason.setValue(this.reasonTypeList[0].id);
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    let password = this.updateForm.controls.password.value;
    if (password == '48oTTYKrmZ' || (this.nonEnablerOwner)) {
      this.update();
    } else {
      this.snackbarService.showErrorMessage("Incorrect Password! Try again!");
    }
  }

  update() {
    let values: FormValues = this.updateForm.value;
    if(!this.nonEnablerOwner){
      if ((values.storeDiscount > 0 || values.ONDiscount > 0) && (this.product.quantityPerItem + values.quantityPerItem <= 0 || this.product.quantityPerOrder + values.quantityPerOrder <= 0)) {
        this.snackbarService.showErrorMessage("Quantity per Item or per order can't be 0 while discount > 0");
        return;
      }
      if ((this.product.quantityPerItem + values.quantityPerItem) > (this.product.quantity + values.quantity)) {
        this.snackbarService.showErrorMessage("Quantity per Item can't be greater than " + (this.product.quantity + + values.quantity));
        return;
      }
    }
 
    if(this.nonEnablerOwner){
      if(this.getDiscount() > 0){
        values.quantityPerItem = this.product.quantity - this.product.quantityPerItem; 
        values.quantityPerOrder = this.product.quantity;
      }
    }

    let request: ReqPasswordProductUpdate = {
      itemDto: [{
      itemId: this.product.id,
      price: values.price,
      setPrice: false,  
      cost: !this.nonEnablerOwner ? values.cost : values.price,
      quantity: values.quantity,
      quantityAmendReasonId: values.amendReason,
      minQuantity: values.minQuantity,
      maxQuantity: values.maxQuantity,
      strategyId: values.strategy,
      // netSalePrice: values.price - values.discountAmount,
      netSalePrice: this.getNetSalePrice(),
      storeDiscount: values.storeDiscount,
      onDiscount: values.ONDiscount,
      // discountAmount: values.storeDiscount + values.ONDiscount,
      discountAmount:  this.getDiscount(),
      quantityPerItem: values.quantityPerItem,
      quantityPerOrder: values.quantityPerOrder,
      comments: values.comments ?? '',
      statusId: values.statusId,
      verified: values.verified
      }]
    };

    console.log("request")
    console.log(request)
    console.log(JSON.stringify(request))
    this.updating = true;
    this.inventoryService.updateBranchProductProtected(request).subscribe(
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
    // let discountAmount = this.updateForm.controls.discountAmount.value;
    let discountAmount = this.getDiscount();
    return price - discountAmount;
  }

  /* SUM OF STORE DISCOUNT & OCTOBER-NOW DISCOUNT */
  getDiscount() {
    let storeDiscount = this.updateForm.controls.storeDiscount.value >= 0 ? this.updateForm.controls.storeDiscount.value : 0;
    let ONDiscount = this.updateForm.controls.ONDiscount.value >= 0 ? this.updateForm.controls.ONDiscount.value : 0;
    return storeDiscount + ONDiscount;
  }
}


class ProductType {
  id: number;
  title: string;
}

class FormValues {
  cost: number;
  price: number;
  storeDiscount: number;
  ONDiscount: number;
  discountAmount: number;
  quantityPerItem?: number;
  quantityPerOrder?: number;
  quantity: number;
  amendReason: number;
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