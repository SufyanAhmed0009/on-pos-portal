import { Component, OnInit } from '@angular/core';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { DtSheetProduct, ReqSheetUpload, ReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { Direction } from '@angular/cdk/bidi';
import { Router } from '@angular/router';
import { WhUpdateInventoryComponent } from '../update-inventory/update-inventory.component';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';

@Component({
  selector: 'wh-upload-sheet',
  templateUrl: './upload-sheet.component.html',
  styleUrls: ['./upload-sheet.component.css']
})
export class WhUploadSheetComponent implements OnInit {

  uploading: boolean;
  productsList: DtSheetProduct[];
  uploaded: boolean;
  submitting: boolean;

  columnsList = [
    'id',
    'title',
    'cost',
    'quantity',
    'price'
  ]

  constructor(
    private snackbarService: ServiceSnackbar,
    private authService: ServiceAuth,
    private purchaseService: ServiceWarehousePurchases,
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
        if (data.length >= 4) {
          let product: DtSheetProduct = {
            libraryItemId: +data[0],
            title: data[1],
            cost: +data[2],
            quantity: +data[3]
          }
          if (data[4]) {
            product.price = +data[4];
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

    let request: ReqWarehouseSheetUpload = {
      whId: warehouseId,
      products: this.productsList,
    }

    this.submitting = true;
    this.purchaseService.uploadSheet(request).subscribe(
      (response: number) => {
        this.submitting = false;
        this.confirmUpload(response, request);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error uploading!");
      }
    );
  }

  confirmUpload(invoiceId: number, request: ReqWarehouseSheetUpload) {
    this.matDialog.open(WhUpdateInventoryComponent, {
      width: '900px',
      data: { id: invoiceId, invoice: request, isApproved: false },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

}
