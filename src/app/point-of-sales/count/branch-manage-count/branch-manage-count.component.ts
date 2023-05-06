import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RespStoreProduct, RespWarehouseProduct } from 'src/app/core/models/products';
import {  ReqBranchCount, RespPurchaseItem } from 'src/app/core/models/purchases';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { BranchCountService } from 'src/app/core/services/branch-count.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-branch-manage-count',
  templateUrl: './branch-manage-count.component.html',
  styleUrls: ['./branch-manage-count.component.css']
})
export class BranchManageCountComponent implements OnInit {

  
  selectedWarehouse: number;
  products: RespPurchaseItem[];
  countNo: string;
  
  /* LOADER */
  submitting: boolean;

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  constructor(
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private countService: BranchCountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.products = [];
    this.selectedWarehouse = this.authService.getBranchId();
    this.authService.storeChanged.subscribe(
      (branch: DtSelectItem) => {
        this.selectedWarehouse = branch.id;
      }
    );
  
    this.countService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

  }

  //to do
  /* EVENT-HANDLERS */
  onHistory() {
    this.router.navigate(['/pos/count/history']);
  }

  onAddProduct(product: RespStoreProduct) {
    let index = this.products.findIndex((item) => item.libraryItemId == product.id);
    if (index == -1) {
      let products = this.products.map((item) => item);
      products.unshift({
        libraryItemId: product.id,
        title: product.title,
        retailPrice: product.retailPrice,
        quantity: 1,
        cost: 0,
        price: 0
      });
      this.products = products;
      console.log("this.purchaseProducts")
      console.log(this.products)
    } else {
      this.products[index].quantity++;
      // this.snackbarService.showInfoMessage("Already Added!");
    }

  }

  onAddCount() {
    if (this.areValuesValid()) {
      this.sendPurchaseRequest();
    } else {
      this.snackbarService.showErrorMessage("Quantity can't be negative!")
    }
  }

  sendPurchaseRequest() {
    let request: ReqBranchCount = {
      branchId: this.selectedWarehouse,
      branchCount: this.products,
      countNumber: this.countNo
    }
    console.log(request);
    this.submitting = true;
    this.countService.addNewCount(request).subscribe(
      () => {
        this.submitting = false;
        this.snackbarService.showSuccessMessage("Successfully Added");
        //to do

        this.router.navigate(['/pos/count/history']);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Adding Count");
      }
    );
  }

  areValuesValid() {
    let valid = true;
    this.products.forEach(
      (item) => {
        if (item.quantity < 0) {
          valid = false;
        }
      }
    );
    return valid;
  }
}
  
export class DtPurchaseOrder{
  id: number;
  title: string;
}