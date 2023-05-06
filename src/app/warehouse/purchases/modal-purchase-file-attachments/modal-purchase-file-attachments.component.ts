import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { AttachFilesResponse } from 'src/app/core/models/products';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceWarehousePurchases } from 'src/app/core/services/warehouse-purchase.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-modal-purchase-file-attachments',
  templateUrl: './modal-purchase-file-attachments.component.html',
  styleUrls: ['./modal-purchase-file-attachments.component.css']
})
export class ModalPurchaseFileAttachmentsComponent implements OnInit {

  /* LOADER */
  isLoading: boolean;
  isDownloading: boolean;

  /* LIST */
  fileList: AttachFilesResponse[] = [];

  /* MAT-TABLE */
  columnsList = [
    'id',
    'fileName',
    'actions'
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) private transactionId: number,
    private dialogRef: MatDialogRef<ModalPurchaseFileAttachmentsComponent>,
    private matDailog: MatDialog,
    private purchaseService: ServiceWarehousePurchases,
    private snackBarService: ServiceSnackbar,
    private languageService: ServiceLanguage,

  ) { }

  ngOnInit(): void {
    console.log("this.transactionId")
    console.log(this.transactionId)
    this.getFileDetails();

  }

  getFileDetails() {
    this.isLoading = true;
    this.purchaseService.getFileAttachmentDetails(this.transactionId).subscribe(
      (response: AttachFilesResponse[]) => {
        console.log("response")
        console.log(response)
        this.fileList = response;
        this.isLoading = false;
      }
    )
  }

  onDownload(element: AttachFilesResponse) {
    /* ON DOWNLOAD */
    this.isDownloading = true;
    this.purchaseService.downloadFileAttachment(element.documentUpload.id ).pipe(map((res) => {
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

  onDelete(element: AttachFilesResponse) {
    console.log("Delete")
    console.log(element);
    let confirmData: DtConfirmMessage = {
      message: "Are You Sure You Want To Delete this file?",
      confirm: "Go Ahead!",
      cancel: "Cancel"
    }

    let dialogRef = this.matDailog.open(ConfirmDialogComponent, {
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
              this.snackBarService.showSuccessMessage("File deleted successfully.");
              this.getFileDetails();
              this.purchaseService.dataUpdated.emit();
            },
            (error) => {
              this.isLoading = false;
              this.snackBarService.showErrorMessage("Error deleting file.");
            }
          );
        }
      }
    );
  }


  onClose() {
    this.dialogRef.close();
  }
}

