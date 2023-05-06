import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DtSheetProduct, ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceWarehousePrePurchase } from 'src/app/core/services/warehouse-pre-purchase.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';

@Component({
  selector: 'Wh-pre-purchases-upload-sheet',
  templateUrl: './pre-purchases-upload-sheet.component.html',
  styleUrls: ['./pre-purchases-upload-sheet.component.css']
})
export class WhPrePurchasesUploadSheetComponent implements OnInit {

  uploading: boolean;
  productsList: DtSheetProduct[];
  uploaded: boolean;
  submitting: boolean;

  purchaseOrderNo: string;

  columnsList = [
    'id',
    'title',
    'quantity',
  ]

  constructor(
    private snackbarService: ServiceSnackbar,
    private authService: ServiceAuth,
    // private purchaseService: ServiceWarehousePrePurchase,
    private prePurchaseService: ServiceWarehousePrePurchase,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSelected(event: any) {
    // debugger
    // if(!this.poNumber){
    //   this.snackbarService.showErrorMessage("Please Enter PO Number");
    // }
    let files: File[] = event.srcElement.files;
    if (files.length > 0) {
      let file = files[0];
      if (this.isValidCSV(file)) {
        this.readCSV(file);
      } else {
        this.snackbarService.showErrorMessage("Not a valid csv file.");
      }
    }
  }

  isValidCSV(file: File) {
    return file.name.endsWith(".csv");
  }

  readCSV(file: File) {
    this.uploading = true;
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      let data = reader.result;
      let lines = (<string>data).split(/\r\n|\n/);
      this.setProducts(lines);
      this.uploading = false;
    };
    reader.onerror = () => {
      console.error('Error reading file!');
      this.uploading = false;
    };
  }

  setProducts(lines: string[]) {
    let products: DtSheetProduct[] = [];
    lines = lines.slice(1);
    lines.forEach(
      (line: string) => {
        let data = line.split(',');
        if (data.length >= 3) {
          let product: DtSheetProduct = {
            libraryItemId: +data[0],
            title: data[1],
            quantity: +data[2]
          }
          products.push(product);
        }
      }
    );
    this.productsList = products;
    this.uploaded = true;
  }

  onSubmit() {
    let warehouseId = this.authService.getBranchId();
    if (!this.purchaseOrderNo) {
      this.snackbarService.showErrorMessage("Please Enter Purchase Order Number");
    }
    else {


      console.log("this.poNumber")
      console.log(this.purchaseOrderNo)
      let request: ReqWarehouseSheetUpload = {
        whId: warehouseId,
        products: this.productsList,
        poNumber: this.purchaseOrderNo
      }
      console.log("request")
      console.log(request)
      console.log(JSON.stringify(request))

      this.submitting = true;
      this.prePurchaseService.uploadSheet(request).subscribe(
        (response) => {
          console.log("response")
          console.log(response)
          this.submitting = false;
          this.router.navigate(['/warehouse/purchases/pre-purchases/history']);
          // this.confirmUpload(response, request);
        },
        (error) => {
          this.submitting = false;
          this.snackbarService.showErrorMessage("Error uploading!");
        }
      );
    }
  }

  
 /* EVENT-HANDLERS */
 onHistory() {
  this.router.navigate(['/warehouse/purchases/pre-purchases/history']);
}

}
