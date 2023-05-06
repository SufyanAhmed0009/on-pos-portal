import { Component, OnInit, Inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { RespOrderDetails, ReqUpdateOrderStatus } from 'src/app/core/models/orders';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { DtStatus } from 'src/app/core/models/status';
import { DatePipe } from '@angular/common';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  order: RespOrderDetails;
  viewOnly: boolean;

  columnsList = [
    'id',
    'title',
    'actualPrice',
    'discount',
    'price',
    'quantity',
    'netPrice',
    'store'
  ];

  statusClass: any;
  storeId: number;
  statusList: DtStatus[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DtDetailsInput,
    private ordersService: ServiceOrders,
    private authService: ServiceAuth,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private dialogRef: MatDialogRef<OrderDetailsComponent>,
    private datePipe: DatePipe,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {

    this.storeId = this.authService.getBranchId();
    this.statusList = StatusConstants.STATUS_LIST;
    this.viewOnly = this.authService.isSpectator();
    this.getDetails();
    this.statusClass = {
      'maroon': this.data.status == 'New',
      'green': this.data.status == 'Ready',
      'gray': this.data.status == 'Order Dispatched'
    }

  }

  getDetails() {
    this.loading = true;
    this.ordersService.getOrderDetails(this.data.id, this.data.branchId).pipe(
      tap((response: RespOrderDetails) => {
        this.loading = false;
        this.order = response;
      })
    ).subscribe();
  }

  isEditable() {
    if (
      this.data.status == 'Delivered' ||
      this.data.status == 'DispatchOrder') {
      return false;
    } else {
      return true;
    }
  }

  getStatusTitle(code: string) {
    let status = this.statusList.find((item) => item.code == code);
    if (status) {
      return status.title;
    } else {
      return code;
    }

  }

  getBranchTotal() {
    let total = 0;
    if (this.order.orderItemList) {
      this.order.orderItemList.forEach((item) => {
        total += ((item.price - item.discount) * item.quantity)
      })
    }
    return total;
  }

  getTime(timestamp: number) {
    return new Date(timestamp);
  }

  getFeedbackScore(feedback: { title: string; score: number }) {
    if (feedback.title == 'Order') {
      if (this.order.orderDetails.isReviewd == true) {
        return feedback.score;
      } else {
        return ' -';
      }
    } else {
      return feedback.score;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onMakeReady() {
    let request: ReqUpdateOrderStatus = {
      languageInfo: {
        code: "LANG0001"
      },
      timeStamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      customerOrderId: '' + this.data.id,
      branchId: '' + this.authService.getBranchId()
    }
    this.submitting = true;
    this.ordersService.makeOrderReady(request).subscribe(
      (response: any) => {
        let type = response?.data?.message?.type;
        if (type == 'error') {
          this.snackbarService.showErrorMessage(response?.data?.message?.value);
          this.submitting = false;
        } else {
          this.data.status = 'Ready';
          this.submitting = false;
          this.ordersService.dateUpdated.emit();
        }

      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating!");
      }
    );
  }

  onDispatchOrder() {
    let request: ReqUpdateOrderStatus = {
      languageInfo: {
        code: "LANG0001"
      },
      timeStamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      customerOrderId: '' + this.data.id,
      branchId: '' + this.authService.getBranchId()
    }
    this.submitting = true;
    this.ordersService.dispatchOrder(request).subscribe(
      (response: any) => {
        let type = response?.data?.message?.type;
        if (type == 'error') {
          this.snackbarService.showErrorMessage(response?.data?.message?.value);
          this.submitting = false;
        } else {
          this.data.status = 'Order Dispatched';
          this.submitting = false;
          this.ordersService.dateUpdated.emit();
        }
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating!");
      }
    );
  }

}

class DtDetailsInput {
  id: number;
  status: string;
  riderId: string;
  branchId: number;
  membershipType: {
    id: number;
    title: string;
    code: string;
  }
  statusLog: {
    code: string;
    tsClient: number;
    tsServer: string;
    tsServerTime: number;
  }[];
  timeLog: {
    placed?: Date;
    expected?: Date;
    delivered?: Date;
  };
  appVersion: string;
}