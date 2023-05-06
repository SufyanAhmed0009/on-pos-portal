import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DtSheetProduct, ReqStoreSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceStorePrePurchase } from 'src/app/core/services/store-pre-purchase.service';

@Component({
  selector: 'app-store-pre-purchases-upload-sheet',
  templateUrl: './store-pre-purchases-upload-sheet.component.html',
  styleUrls: ['./store-pre-purchases-upload-sheet.component.css']
})
export class StorePrePurchasesUploadSheetComponent implements OnInit {

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
    private prePurchaseService: ServiceStorePrePurchase,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSelected(event: any) {
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
    let storeId = this.authService.getBranchId();
    if (!this.purchaseOrderNo) {
      this.snackbarService.showErrorMessage("Please Enter Purchase Order Number");
    }
    else {
      console.log("this.poNumber")
      console.log(this.purchaseOrderNo)
      let request: ReqStoreSheetUpload = {
        branchId: storeId,
        branchProducts: this.productsList,
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
          this.router.navigate(['/pos/purchases/pre-purchases/history']);
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
  this.router.navigate(['/pos/purchases/pre-purchases/history']);
}

}
