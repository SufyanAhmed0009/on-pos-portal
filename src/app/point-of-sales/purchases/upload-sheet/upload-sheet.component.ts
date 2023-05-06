import { Component, OnInit } from '@angular/core';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { DtSheetProduct, ReqSheetUpload } from 'src/app/core/models/sheet-product';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { Direction } from '@angular/cdk/bidi';
import { Router } from '@angular/router';
import { UpdateInventoryComponent } from '../update-inventory/update-inventory.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload-sheet',
  templateUrl: './upload-sheet.component.html',
  styleUrls: ['./upload-sheet.component.css']
})
export class UploadSheetComponent implements OnInit {

  uploading: boolean;
  productsList: DtSheetProduct[];
  uploaded: boolean;
  submitting: boolean;
  whControl: FormControl;

  columnsList = [
    'id',
    'title',
    'cost',
    'quantity',
    'price'
  ]

  whList: SelectItem[] = [];
  selectedWh: number;
  deliveryOrderNo: string;

  constructor(
    private snackbarService: ServiceSnackbar,
    private authService: ServiceAuth,
    private purchaseService: ServicePurchases,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.whControl = new FormControl();
    this.purchaseService.getListOfWh().subscribe(
      (response: any[]) => {
        this.whList = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title
            }
          }
        );
      }
    );
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
    let branchId = this.authService.getBranchId();
    let request: ReqSheetUpload = {
      branchId: branchId,
      whId: this.selectedWh,
      products: this.productsList,
      deliveryOrderNo: this.deliveryOrderNo
    }
    this.submitting = true;
    this.purchaseService.uploadSheet(request).subscribe(
      (response: number) => {
        this.submitting = false;
        this.confirmUpload(response['purchaseId'], request);
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error uploading!");
      }
    );
  }

  confirmUpload(invoiceId: number, request: ReqSheetUpload) {
    this.matDialog.open(UpdateInventoryComponent, {
      width: '800px',
      data: { id: invoiceId, invoice: request, isApproved: false },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

}

class SelectItem {
  id: number;
  title: string;
}