import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReqSheetUpload, DtSheetProduct } from 'src/app/core/models/sheet-product';
import { Router } from '@angular/router';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { DisputeReasonResponse, RespPurchaseItem } from 'src/app/core/models/purchases';
import { FormControl } from '@angular/forms';
import { DtPricingStrategy } from 'src/app/core/models/pricing-strategy';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { RespStoreLibraryItem } from 'src/app/core/models/inventory';
import { MatTable } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ServiceStatus } from 'src/app/core/services/status.service';
import { DtStatus } from 'src/app/core/models/status';
import { ServiceInfoModal } from 'src/app/core/services/info-modal.service';

@Component({
  selector: 'app-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.css']
})
export class UpdateInventoryComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  invoiceId: number;
  invoiceRequest: ReqSheetUpload;
  isApproved: boolean;
  whList: SelectItem[] = [];
  selectedWh: number;
  pricingStrategyList: DtPricingStrategy[];

  /* SHOW TITLE CONDITION */
  showTitle: boolean = false;

  statusList: DtStatus[] = [];
  disputeReasonList: DisputeReasonResponse[] = [];

  columnsList = [
    'id',
    'title',
    'status',
    'reason',
    'whCost',
    'weightedCost',
    'cost',
    'quantity',
    'pricingStrategy',
    'price',
    'retailPrice',
    'comment',
    'delete'
  ];

  /* ANGULAR MAT TABLE */
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private dialogRef: MatDialogRef<UpdateInventoryComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: { id: number, invoice: ReqSheetUpload, isApproved: boolean },
    private router: Router,
    private snackbarService: ServiceSnackbar,
    private purchaseService: ServicePurchases,
    private languageService: ServiceLanguage,
    private statusService: ServiceStatus,
    private infoModalService: ServiceInfoModal,
  ) { }

  ngOnInit(): void {

    this.invoiceId = this.data.id;
    this.invoiceRequest = this.data.invoice;
    this.isApproved = this.data.isApproved;
    console.log("this.invoiceRequest")
    console.log(this.invoiceRequest)
    // this.pricingStrategyList = StatusConstants.PRICING_STRATEGY_LIST.filter(
    //   (item) => item.type == "S"
    // );

    this.purchaseService.getPricingStrategyList('S').subscribe(
      (response: any[]) => {
        this.pricingStrategyList = response;
      }
    );

    this.getPurchaseDetails();

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

    this.purchaseService.showTitle().subscribe(
      (response: boolean) => {
        this.showTitle = response;
      });

    this.statusService.getStatusList('DO').subscribe(
      (response: DtStatus[]) => {
        this.statusList = response.map(
          (item) => {
            return {
              id: item.id,
              title: item.title,
            }
          }
        );
      }
    );

    /* DISPUTE REASON LIST */
    this.purchaseService.getDisputeReasons().subscribe(
      (response: DisputeReasonResponse[]) => {
        this.disputeReasonList = response;
        console.log("this.disputeReasonList")
        console.log(this.disputeReasonList)
      }
    )
  }

  getPurchaseDetails() {
    this.loading = true;
    this.purchaseService.getPurchaseInfo(this.data.id).subscribe(
      (response: RespPurchaseItem[]) => {
        console.log("response");
        console.log(response);
        response.forEach(item => {
          item.quantityHistory = item.quantityHistory.reverse()
        })
        this.invoiceRequest.products = response.map(
          (item) => {
            this.selectedWh = item.whId;
            return {
              id: item.id,
              title: item.title,
              cost: item.cost,
              price: item.price,
              quantity: item.quantity,
              lastQuantity: item.quantityHistory[1] ?? 'NA',
              libraryItemId: item.libraryItemId,
              pricingStrategy: item.pricingStrat,
              itemCost: item.itemCost,
              itemQuantity: item.itemQuantity,
              retailPrice: item.retailPrice,
              whCost: item.whCost,
              statusId: item.statusId,
              status: { id: item.statusId },
              totalQuantity: item.quantity,
              unapprovedQuantity: item.unapprovedQuantity ? item.unapprovedQuantity : 0,
              whQuantity: item.whQuantity,
              comment: item.comment,
              reasonId: item.reasonId,
              reasonTitle: item.reasonTitle
            }
          }
        );
        console.log("this.invoiceRequest.products")
        console.log(this.invoiceRequest.products)
        this.loading = false;
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  onCancel() {
    this.router.navigate(['/pos/purchases/history']);
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

    /* SET STATUS TO PENDING STATE */
    this.invoiceRequest.products.map(
      (item) => {
        item.status.id = 32;
        // item.statusId = 32;
      }
    );

    if (!this.isValid()) {
      // this.snackbarService.showErrorMessage("Cost or Quantity can't be zero or less.");
      this.snackbarService.showErrorMessage("Quantity can't be zero or less.");
    } else if (this.isHighlighted() != 0) {

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
            this.invoiceRequest.branchPurchaseId = this.invoiceId;
            this.invoiceRequest.whId = this.selectedWh;
            console.log(JSON.stringify(this.invoiceRequest));
            this.purchaseService.updateInventory(this.invoiceRequest).subscribe(
              (response) => {
                this.purchaseService.dataUpdated.emit();
                if (approve)
                  this.onApprove();
                else {
                  // this.router.navigate(['/pos/purchases/history']);
                  this.snackbarService.showSuccessMessage("Successfully Updated!");
                  // this.dialogRef.close();
                  this.getPurchaseDetails();
                  this.submitting = false;
                }
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
      this.invoiceRequest.branchPurchaseId = this.invoiceId;
      this.invoiceRequest.whId = this.selectedWh;
      console.log(JSON.stringify(this.invoiceRequest));
      this.purchaseService.updateInventory(this.invoiceRequest).subscribe(
        (response) => {
          this.purchaseService.dataUpdated.emit();
          if (approve)
            this.onApprove();
          else {
            // this.router.navigate(['/pos/purchases/history']);
            this.snackbarService.showSuccessMessage("Successfully Updated! Status: Pending");
            // this.dialogRef.close();
            this.getPurchaseDetails();
            this.submitting = false;
          }
        },
        (error) => {
          this.snackbarService.showErrorMessage("Error updating data!");
          this.submitting = false;
        }
      );

    }
  }

  onAddProduct(product: RespStoreLibraryItem) {
    if (!this.selectedWh) {
      this.snackbarService.showErrorMessage("Please select warehouse!")
      return;
    }
    debugger
    let index = this.invoiceRequest.products.findIndex((item) => item.libraryItemId == product.id);
    if (index == -1) {
      let products = this.invoiceRequest.products.map((item) => item);
      products.unshift({
        id: null,
      title: product.title,
      cost: 0,
      quantity: 1,
      libraryItemId: product.id,
      pricingStrategy: 1,
      price: 0,
      itemCost: 0,
      itemQuantity: 0,
      statusId: 0,
      status: { id: 0 },
      totalQuantity: product.quantity,
      unapprovedQuantity: product.unapprovedQuantity ? product.unapprovedQuantity : 0
      });
      this.invoiceRequest.products = products;
    } else {
      if(this.invoiceRequest.products[index].statusId == 37 || this.invoiceRequest.products[index].statusId == 32 || this.invoiceRequest.products[index].statusId == 0){
      if (this.invoiceRequest.products[index].quantity < (product.totalQuantity - product.unapprovedQuantity) ) {
        this.invoiceRequest.products[index].quantity++;
        this.invoiceRequest.products[index].itemCost = this.invoiceRequest.products[index].cost *
        this.invoiceRequest.products[index].quantity;
      } else {
        this.snackbarService.showErrorMessage("Max limit reached. Total quantity in Warehouse: " + (product.totalQuantity - product.unapprovedQuantity));
      }
    }else {
      this.snackbarService.showErrorMessage("Item already in process");
    }
    }
    // this.invoiceRequest.products.push({
    //   id: null,
    //   title: product.title,
    //   cost: 0,
    //   quantity: 1,
    //   libraryItemId: product.id,
    //   pricingStrategy: 1,
    //   price: 0,
    //   itemCost: 0,
    //   itemQuantity: 0,
    //   statusId: 0,
    //   status: { id: 0 },
    //   totalQuantity: product.quantity,
    //   unapprovedQuantity: product.unapprovedQuantity ? product.unapprovedQuantity : 0

    // });

    console.log("this.invoiceRequest.products")
    console.log(this.invoiceRequest.products)
    this.table.renderRows();
  }

  onApprove() {
    this.submitting = true;
    this.purchaseService.confirmSheetUpload(this.invoiceId, this.selectedWh).subscribe(
      (response) => {
        console.log(response);
        if ((response['notEnough'] && response['notEnough'].length > 0) || (response['notAvailable'] && response['notAvailable'].length > 0)) {
          this.snackbarService.showErrorMessage("Error approving. Some items not available or less in quantity.");
        }
        this.submitting = false;
        this.isApproved = true;
        this.router.navigate(['/pos/purchases/history']);
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

  onSubmit() {
    this.submitting = true;
    console.log("this.invoiceRequest")
    console.log(this.invoiceRequest)
    this.invoiceRequest.branchPurchaseId = this.invoiceId;

    /* SET STATUS TO INPROGRESS STATE */
    this.invoiceRequest.products.map(
      (item) => {
        item.status.id = 35;
        // item.statusId = 35;
      }
    );

    this.invoiceRequest.whId = this.selectedWh;

    console.log(JSON.stringify(this.invoiceRequest));
    this.purchaseService.updateInventory(this.invoiceRequest).subscribe(
      (response) => {
        this.purchaseService.dataUpdated.emit();
        // this.snackbarService.showSuccessMessage("Successfully Updated!");
        this.snackbarService.showSuccessMessage("Successfully Updated! Status: InProgress");
        this.getPurchaseDetails();
        this.submitting = false;

      },
      (error) => {
        this.snackbarService.showErrorMessage("Error updating data!");
        this.submitting = false;
      }
    );
  }


  isValid() {
    let valid = true;
    this.invoiceRequest.products.forEach(
      (item) => {
        // if (item.cost <= 0) {
        //   valid = false;
        // }
        if (item.quantity <= 0) {
          valid = false;
        }
        // if (item.price <= 0){
        //   valid = false;
        // }
      }
    );
    return valid;
  }

  onSelectPricingStrategy(change: MatSelectChange) {
    let value: number = change.value;
    this.invoiceRequest.products.forEach((item) => {
      // ID 37 IS DISPUTE
      if (item.statusId == 37 || item.statusId == 0) {
        item.pricingStrategy = value;
      }
    });
  }

  toggleDelete(product: DtSheetProduct) {
    if (product.state) {
      product.state = null;
    } else {
      product.state = 'D';
    }
  }

  getWeightedCost(item: RespPurchaseItem) {

    item.weightedCost = ((item.itemQuantity * item.itemCost) + (item.quantity * item.cost))
      / (item.itemQuantity + item.quantity);
     
    if (item.statusId == 37 || item.statusId == 32 || item.statusId == 0) {
      let product = this.invoiceRequest.products.find(x => x.id == item.id);

       // whQuantity-unApprovedQuantity+quantity
       let temp = product.whQuantity - product.unapprovedQuantity;
       let result = temp + product.totalQuantity;
       if (product.quantity > result) {
        product.quantity = result;
        this.snackbarService.showErrorMessage("Max limit reached. Total quantity in Warehouse: " + result );
      }

      // if (product.quantity > (product.totalQuantity - product.unapprovedQuantity)) {
      //   product.quantity = product.totalQuantity - product.unapprovedQuantity;
      //   this.snackbarService.showErrorMessage("Max limit reached. Total quantity in Warehouse: " + (product.totalQuantity - product.unapprovedQuantity));
      // }
    }

    return item.weightedCost;
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

  /* DISPLAY COMMENT */
  showComment(product: DtSheetProduct) {
    this.infoModalService.openInfoModal(product.comment);
  }

}


class SelectItem {
  id: number;
  title: string;
}
