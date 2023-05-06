import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchWiseDailySales } from 'src/app/core/models/dashboard';
import { DtPage } from 'src/app/core/models/page';
import { RespPurchase, RespPurchaseList } from 'src/app/core/models/purchases';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServicePurchases } from 'src/app/core/services/purchase.service';
import { PurchaseDetailsComponent } from '../../purchases/purchase-details/purchase-details.component';

@Component({
  selector: 'app-modal-dos',
  templateUrl: './modal-dos.component.html',
  styleUrls: ['./modal-dos.component.css']
})
export class ModalDOSComponent implements OnInit {


  /* PURCHASES */
  purchases: RespPurchase[];

  /* FOR TABLE */
  columnsList = [
    'id',
    'date',
    'whTitle',
    'deliveryOrderNo',
    'total',
    'approved'
  ]

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* PAGINATION */
  loading: boolean;
  page: DtPage;
  count: number;

  constructor(@Inject(MAT_DIALOG_DATA) private data: BranchWiseDailySales,
    private dialogRef: MatDialogRef<ModalDOSComponent>,
    private matDialog: MatDialog,
    private purchasesService: ServicePurchases,
    private languageService: ServiceLanguage,) { }

  ngOnInit(): void {
    console.log(this.data);
    this.selectedStore = {
      id: this.data.branchId,
      title: this.data.branchTitle,
      details: ''
    }
    this.initPage();
    this.getPurchasesList();
  }
  initPage() {
    this.page = {
      size: 100,
      page: 0,
    }
  }
  getPurchasesList() {
    this.loading = true;
    this.page.id = this.selectedStore.id;
    this.page.dosIds = this.data.dosId;
    console.log(this.page);
    this.purchasesService.getPurchaseList(this.page).subscribe(
      (response: RespPurchaseList) => {
        console.log(response);
        this.count = response.count;
        this.purchases = response.transactionList;
        this.loading = false;
      }
    );
  }
  onSelectPurchase(purchase: RespPurchase) {
    this.showPurchaseDetails(purchase);

  }
  showPurchaseDetails(purchase: RespPurchase) {
    this.matDialog.open(PurchaseDetailsComponent, {
      width: '900px',
      data: purchase,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  getDate(timestamp: number) {
    return new Date(timestamp);
  }
}
