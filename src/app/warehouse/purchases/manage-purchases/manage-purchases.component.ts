import { Component, OnInit, ViewChild } from '@angular/core';
import { DtWhPurchaseProduct, RespWarehouseProduct } from 'src/app/core/models/products';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { Router } from '@angular/router';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ReqWarehousePurchaseItem, ReqWarehousePurchase } from 'src/app/core/models/purchases';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-manage-purchases',
  templateUrl: './manage-purchases.component.html',
  styleUrls: ['./manage-purchases.component.css']
})
export class WhManagePurchasesComponent implements OnInit {

  selectedWarehouse: number;
  purchaseProducts: DtWhPurchaseProduct[];
  suppliersList: DtSupplier[];
  purchaseOrderNo: string;
  selectedSupplier: number;
  selectedPOId: number;
  PurchaseOrderList: DtPurchaseOrder[];

  /* LOADER */
  submitting: boolean;

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  /* FILE UPLOAD FORM */
  uploadForm: FormGroup;
  attachFiles:any [] = [];

  /* MAT-TABLE */
  columnsList = [
    // 'id',
    'name',
    'size',
    'actions',
  ];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private matDialog: MatDialog,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private purchasesService: ServiceWarehousePurchases,
    private suppliersService: ServiceWarehouseSuppliers,
    private router: Router,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {
    this.purchaseProducts = [];
    this.selectedWarehouse = this.authService.getBranchId();
    this.authService.storeChanged.subscribe(
      (warehouse: DtSelectItem) => {
        this.selectedWarehouse = warehouse.id;
      }
    );
    this.suppliersList = [];
    this.suppliersService.getListOfAllSuppliers().subscribe(
      (response: DtSupplier[]) => {
        this.suppliersList = response;
      }
    );

    this.purchasesService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

    this.purchasesService.getPurchaseOrderList(this.selectedWarehouse).subscribe(
      (response: DtPurchaseOrder[]) => {
        console.log(response)
        this.PurchaseOrderList = response;
      }
    )

    this.uploadForm = new FormGroup({
      profile: new FormControl(null, Validators.required),
    });
  }

  getTotalCost() {
    let sum = 0;
    this.purchaseProducts.forEach(
      (item) => {
        sum += (item.cost * item.quantity);
      }
    )
    return sum;
  }

  /* EVENT-HANDLERS */
  onHistory() {
    this.router.navigate(['/warehouse/purchases/history']);
  }

  onAddProduct(product: RespWarehouseProduct) {
    console.log("Add product")
    console.log(product)
    let index = this.purchaseProducts.findIndex((item) => item.id == product.id);
    if (index == -1) {
      let products = this.purchaseProducts.map((item) => item);
      products.unshift({
        id: product.id,
        name: product.title,
        barcode: product.barcode,
        retailPrice: product.retailPrice,
        quantity: 1,
        cost: 0,
        price: 0,
        strategyId: 8,
        itemCost: 0
      });
      this.purchaseProducts = products;
      console.log("this.purchaseProducts")
      console.log(this.purchaseProducts)
    } else {
      this.purchaseProducts[index].quantity++;
      // this.snackbarService.showInfoMessage("Already Added!");
    }

  }

  onAddPurchase() {
    if (this.areValuesValid()) {
      this.sendPurchaseRequest();
    } else {
      this.snackbarService.showErrorMessage("Cost or quantity can't be negative!")
    }
  }

  // onFileSelected(event) {
  //   console.log("event")
  //   console.log(event)
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     if (this.isValid(file)) {
  //       this.uploadForm.get('profile').setValue(file);
  //       this.snackbarService.showSuccessMessage("Successfully Uploaded!");
  //     } else {
  //       this.snackbarService.showErrorMessage("Not a valid file type!");
  //     }
  //   }
  // }

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files;
      const fileListSize = event.target.files.length;
      console.log("filesLength")
      console.log(fileListSize)

      if (this.isValid(file, fileListSize) === fileListSize) {
        this.uploadForm.get('profile').setValue(file);
        for (var i = 0; i < event.target.files.length; i++) { 
          this.attachFiles.push(event.target.files[i]);
      }
        // for (var i = 0; i < fileListSize; i++) {
        //   this.attachFiles.push({
        //     name: file[i].name,
        //     type: file[i].type,
        //     size: file[i].size
        //   });
        // }
        console.log("this.attachFiles")
        console.log(this.attachFiles)
        this.table.renderRows();
        this.snackbarService.showSuccessMessage("Successfully Uploaded!");

        console.log("this.uploadForm.controls.profile.value")
        console.log(this.uploadForm.controls.profile.value)
      } else {
        this.snackbarService.showErrorMessage("file format is not supported!");
      }
    }
  }

  isValid(file: File, FileListSize: number) {
    let num = 0;
    for (var i = 0; i < FileListSize; i++) {
      let fileName = file[i].name.toLowerCase();
      console.log("fileName")
      console.log(fileName)
      var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
      console.log("ext")
      console.log(ext)
      if (ext == 'png' ||
        ext == 'jpg' ||
        ext == 'jpeg' ||
        ext == 'csv' ||
        ext == 'xlsx' ||
        ext == 'pdf') {
        num++;
      }
    }
    console.log("return")
    console.log(num)
    return num;
  }

  sendPurchaseRequest() {

    // console.log("this.uploadForm")
    // console.log(this.uploadForm)
    console.log("this.uploadForm.get('profile').value")
    console.log(this.uploadForm.get('profile').value)
    const formData = new FormData();
  console.log("this.attachFiles")
  console.log(this.attachFiles)
    for (var i = 0; i <   this.attachFiles.length; i++) { 
      formData.append("file",   this.attachFiles[i]);
    }
    console.log("formData");
    console.log(formData);
// Display the values
// for (var value of formData.entries()) {
//   console.log(value[0]+'...'+value[1]);
// }
    let request: ReqWarehousePurchase = {
      whPurchaseList: this.purchaseProducts.map(
        (purchaseItem) => {
          let requestItem: ReqWarehousePurchaseItem = {
            item: {
              id: purchaseItem.id
            },
            wh: {
              id: this.selectedWarehouse
            },
            quantity: purchaseItem.quantity,
            cost: purchaseItem.cost,
            pricingStrategy: {
              id: purchaseItem.strategyId,
            }
          }
          if (purchaseItem.strategyId == 3 || purchaseItem.strategyId == 4) {
            requestItem.price = purchaseItem.price;
          }
          return requestItem;
        }
      ),
      prePurchaseId: this.selectedPOId,
      whTransaction: {
        wh: { id: this.selectedWarehouse },
        supplier: { id: this.selectedSupplier },
        purchaseOrderNo: this.purchaseOrderNo,
      }
    }
    formData.append('param', JSON.stringify(request));
    console.log("request");
    // debugger
    console.log(JSON.stringify(request));
    console.log("formData")
    console.log(JSON.stringify(formData))
    if (this.isHighlighted() != 0) {
      let confirmData: DtConfirmMessage = {
        message: "Price difference between cost and price is less or greater than 20%. Do You Want To Continue?",
        confirm: "Go Ahead!",
        cancel: "Cancel"
      }

      let dialogRef = this.matDialog.open(ConfirmDialogComponent, {
        width: '400px',
        direction: <Direction>this.languageService.getCurrentLanguage().dir,
        data: confirmData,
        autoFocus: false
      });

      dialogRef.afterClosed().subscribe(
        (data) => {
          if (data == true) {
            this.submitting = true;
            this.purchasesService.addNewPurchase(formData).subscribe(
              (response) => {
                this.submitting = false;
                this.snackbarService.showSuccessMessage("Successfully Added");
                this.router.navigate(['/warehouse/purchases/history']);
              },
              (error) => {
                this.submitting = false;
                this.snackbarService.showErrorMessage("Error Adding Purchase");
              }
            );
          }
        }
      );
    }
    else {
   
    //   for (var value of formData.values()) {
    //     console.log(value);
    //  }
      this.submitting = true;
      this.purchasesService.addNewPurchase(formData).subscribe(
        (response) => {
          this.submitting = false;
          this.snackbarService.showSuccessMessage("Successfully Added");
          this.router.navigate(['/warehouse/purchases/history']);
        },
        (error) => {
          this.submitting = false;
          this.snackbarService.showErrorMessage("Error Adding Purchase");
        }
      );
    }
  }

  areValuesValid() {
    let valid = true;
    this.purchaseProducts.forEach(
      (item) => {
        if (item.cost < 0) {
          valid = false;
        }
        if (item.quantity < 0) {
          valid = false;
        }
      }
    );
    return valid;
  }

  isHighlighted() {
    let num = 0;
    this.purchaseProducts.forEach(
      (item) => {
        if (item.highCost || item.lowCost) {
          num++;
        }
      }
    );
    return num;
  }

  onRemoveFile(index: number) {
    this.attachFiles.splice(index, 1);
    this.table.renderRows();
  }

}

export class DtPurchaseOrder {
  id: number;
  title: string;
}