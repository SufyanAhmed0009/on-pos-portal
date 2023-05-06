import { Component, OnInit, Inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReqWarehouseSheetUpload, DtSheetProduct, ParamReqWarehouseSheetUpload } from 'src/app/core/models/sheet-product';
import { Router } from '@angular/router';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { RespPurchaseItem } from 'src/app/core/models/purchases';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { DtSupplier } from 'src/app/core/models/suppliers';
import { ServiceWarehouseSuppliers } from 'src/app/core/services/suppliers.service';
import { RespStoreLibraryItem } from 'src/app/core/models/inventory';
import { MatTable } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AttachFilesResponse } from 'src/app/core/models/products';
import { map } from 'rxjs/operators';


@Component({
  selector: 'wh-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.css']
})
export class WhUpdateInventoryComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  invoiceId: number;
  invoiceRequest: ReqWarehouseSheetUpload;
  invoiceParamRequest: ParamReqWarehouseSheetUpload;
  isApproved: boolean;
  pricingStrategyList: DtPricingStrategy[];
  suppliersList: DtSupplier[];

  /*SHOW TITLE CONDITON */
  showTitle: boolean = false;

  columnsList = [
    'id',
    'title',
    'cost',
    'quantity',
    'strategy',
    'price',
    'retailPrice',
    'delete'
  ];

  /* FILE UPLOAD FORM */
  uploadForm: FormGroup;
  attachFiles: any[] = [];
  /* LIST */
  fileList: AttachFilesResponse[] = [];
  isLoading: boolean;
  isDownloading: boolean;

  /* MAT-TABLE */
  fileColumnsList = [
    'id',
    'fileName',
    'actions'
  ];

  /* ANGULAR MAT TABLE */
  // @ViewChild('table', { static: false }) table: MatTable<any>;
  @ViewChildren(MatTable) table !: QueryList<MatTable<string>>;
  
  constructor(
    private dialogRef: MatDialogRef<WhUpdateInventoryComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: { id: number, invoice: ReqWarehouseSheetUpload, isApproved: boolean },
    private router: Router,
    private snackbarService: ServiceSnackbar,
    private purchaseService: ServiceWarehousePurchases,
    private suppliersService: ServiceWarehouseSuppliers,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {

    console.log("this.data")
    console.log(this.data)
    this.uploadForm = new FormGroup({
      profile: new FormControl(null, ),
    });

    // this.pricingStrategyList = StatusConstants.PRICING_STRATEGY_LIST.filter(
    //   (item) => item.type == 'W'
    // );
    this.purchaseService.getPricingStrategyList('W').subscribe(
      (response: any[]) => {
        this.pricingStrategyList = response;
      }
    );

    this.suppliersList = [];
    this.suppliersService.getListOfAllSuppliers().subscribe(
      (response: DtSupplier[]) => {
        this.suppliersList = response;
      }
    );

    this.invoiceId = this.data.id;
    this.invoiceRequest = this.data.invoice;
    this.invoiceParamRequest = this.data.invoice;
    this.isApproved = this.data.isApproved;

    this.loading = true;
    this.purchaseService.getPurchaseInfo(this.data.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log("response");
        console.log(response);
        this.invoiceRequest.products = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title,
              cost: item.cost,
              price: item.price ?? 0,
              quantity: item.quantity,
              libraryItemId: item.libraryItemId,
              pricingStrategy: item.pricingStrat,
              retailPrice: item.retailPrice
            }
          }
        );
        this.loading = false;
      }
    );

    this.purchaseService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      }
    );

    this.getFileDetails();
  }

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    this.router.navigate(['/warehouse/purchases/history']);
    this.dialogRef.close();
  }

  isHighlighted() {
    let num = 0;
    this.invoiceRequest.products.forEach(
      (item) => {
        if (item.highPrice || item.lowPrice) {
          num++;
        }
      }
    );
    return num;
  }

  onUpdate(approve: boolean) {
    const formData = new FormData();
    // console.log("this.attachFiles")
    // console.log(this.attachFiles)
  
      for (var i = 0; i < this.attachFiles.length; i++) {
        formData.append("file", this.attachFiles[i]);
      }

    // console.log("formData");
    // console.log(formData);
  
    this.invoiceParamRequest.products = this.invoiceRequest.products.map(
      (item) => {
        return {
          id: item.id,
          title: item.title,
          cost: item.cost,
          price: item.price ?? 0,
          quantity: item.quantity,
          libraryItemId: item.libraryItemId,
          pricingStrategy: item.pricingStrategy,
          state: item.state ?? null
        }
      }
    );

    if (!this.isValid()) {
      this.snackbarService.showErrorMessage("Cost or Quantity can't be zero or less.");
    }
    else if (this.isHighlighted() != 0) {

      let confirmData: DtConfirmMessage = {
        message: "Difference between cost and price is less or greater than 20%. Do You Want To Continue?",
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
            this.invoiceRequest.whPurchaseId = this.invoiceId;
            this.invoiceParamRequest.whPurchaseId = this.invoiceId;
            // console.log(JSON.stringify(this.invoiceRequest));
            console.log(JSON.stringify(this.invoiceParamRequest))
            formData.append('param', JSON.stringify(this.invoiceParamRequest));
            // this.purchaseService.updateInventory(this.invoiceRequest).subscribe(
            // this.purchaseService.updateInventory(formData).subscribe(
              this.purchaseService.updateInventoryNew(formData).subscribe(
              (response) => {
                this.purchaseService.dataUpdated.emit();
                if (approve) {
                  this.onApprove();
                } else {
                  this.ngOnInit();
                  // this.router.navigate(['/warehouse/purchases/history']);
                  this.snackbarService.showSuccessMessage("Successfully Updated!");
                  // this.dialogRef.close();
                  this.submitting = false;
                }
                this.attachFiles = [];
              },
              (error) => {
                this.snackbarService.showErrorMessage("Error updating data!");
                this.submitting = false;
              }
            );
          }
        }
      );
    }
    else {
     this.submitting = true;
      this.invoiceRequest.whPurchaseId = this.invoiceId;
      this.invoiceParamRequest.whPurchaseId = this.invoiceId;
      
      console.log(JSON.stringify(this.invoiceParamRequest))
      formData.append('param', JSON.stringify(this.invoiceParamRequest));
      // console.log("request");
      // this.purchaseService.updateInventory(this.invoiceRequest).subscribe(
      // this.purchaseService.updateInventory(formData).subscribe(
      this.purchaseService.updateInventoryNew(formData).subscribe(
        (response) => {
          this.purchaseService.dataUpdated.emit();
          if (approve) {
            console.log("approve")
            console.log(approve)
            this.onApprove();
          } else {
            this.ngOnInit();
            // this.router.navigate(['/warehouse/purchases/history']);
            this.snackbarService.showSuccessMessage("Successfully Updated!");
            // this.dialogRef.close();
            this.submitting = false;
          }
          this.attachFiles = [];

        },
        (error) => {
          this.snackbarService.showErrorMessage("Error updating data!");
          this.submitting = false;
        }
      );
    }
  }

  onApprove() {
    this.submitting = true;
    this.purchaseService.confirmSheetUpload(this.invoiceId).subscribe(
      () => {
        this.submitting = false;
        this.isApproved = true;
        this.router.navigate(['/warehouse/purchases/history']);
        this.purchaseService.dataUpdated.emit();
        this.dialogRef.close();
      },
      (error) => {
        console.error(error);
        this.snackbarService.showErrorMessage("Error updating status.");
        this.submitting = false;
      }
    );
  }

  isValid() {
    let valid = true;
    this.invoiceRequest.products.forEach(
      (item) => {
        if (item.cost <= 0) {
          valid = false;
        }
        if (item.quantity <= 0) {
          valid = false;
        }
        // if (item.price <= 0) {
        //   valid = false;
        // }
      }
    );
    return valid;
  }

  onSelectPricingStrategy(change: MatSelectChange) {
    let value: number = change.value;
    this.invoiceRequest.products.forEach((item) => {
      item.pricingStrategy = value;
    });
  }

  toggleDelete(product: DtSheetProduct) {
    if (product.state) {
      product.state = null;
    } else {
      product.state = 'D';
    }
  }

  onAddProduct(product: RespStoreLibraryItem) {
    console.log(product);
    this.invoiceRequest.products.push({
      id: null,
      title: product.title,
      cost: 0,
      quantity: 1,
      libraryItemId: product.id,
      pricingStrategy: 5,
      price: 0
    });
    this.table.first.renderRows();
  }

  priceCheck(product: DtSheetProduct) {
    if (product.price && product.cost) {
      let costPercent = product.cost * 20 / 100;
      let high = product.cost + costPercent;
      let low = product.cost - costPercent;
      if (product.price > high) {
        product.highPrice = true;
        product.lowPrice = false;
      }
      else if (product.price < low) {
        product.lowPrice = true;
        product.highPrice = false;
      }
      else {
        product.highPrice = false;
        product.lowPrice = false;
      }
    }
    return product;
  }

  getFileDetails() {
    this.isLoading = true;
    this.purchaseService.getFileAttachmentDetails(this.data.id).subscribe(
      (response: AttachFilesResponse[]) => {
        console.log("response")
        console.log(response)
        this.fileList = response;
        this.isLoading = false; 
      }
    )
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files;
      const fileListSize = event.target.files.length;
      
      if (this.isFileValid(file, fileListSize) === fileListSize) {
        this.uploadForm.get('profile').setValue(file);
        for (var i = 0; i < fileListSize; i++) {
          this.attachFiles.push(event.target.files[i]);
          this.fileList.push({
            id: 0,
            whPurchaseTransaction: 0,
            documentUpload: {
              id: 0,
              fileName: event.target.files[i].name,
              fileContent: '',
              isZipped: false
            }
          });
        }

        // this.table.renderRows();
        this.table.last.renderRows();
        this.snackbarService.showSuccessMessage("Successfully Uploaded!");

      } else {
        this.snackbarService.showErrorMessage("file format is not supported!");
      }
    }
  }

  isFileValid(file: File, FileListSize: number) {
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

  /* ON FILE DOWNLOAD */
  onFileDownload(element: AttachFilesResponse) {

    this.isDownloading = true;
    this.purchaseService.downloadFileAttachment(element.documentUpload.id).pipe(map((res) => {
      return {
        filename: element.documentUpload.fileName,
        data: new Blob(
          [res]
        ),
      };
    }))
      .subscribe(res => {
        this.isDownloading = false;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(res.data, res.filename);
        } else {
          const link = window.URL.createObjectURL(res.data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = link;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(link);
          a.remove();
        }
      }, error => {
        throw error;
      }, () => {
        console.log('Completed file download.');
      });


  }

  /* ON FILE DELETE */
  onFileDelete(element: AttachFilesResponse) {
    console.log("Delete")
    console.log(element);
    let confirmData: DtConfirmMessage = {
      message: "Are You Sure You Want To Delete this file?",
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
          this.purchaseService.deleteFileAttachment(element.id).subscribe(
            (response) => {
              this.isLoading = false;
              this.snackbarService.showSuccessMessage("File deleted successfully.");
              this.getFileDetails();
              this.purchaseService.dataUpdated.emit();
            },
            (error) => {
              this.isLoading = false;
              this.snackbarService.showErrorMessage("Error deleting file.");
            }
          );
        }
      }
    );
  }
}
