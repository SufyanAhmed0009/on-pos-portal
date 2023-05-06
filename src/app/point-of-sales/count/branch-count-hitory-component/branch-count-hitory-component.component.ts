import { Component, OnInit } from '@angular/core';
import { RespBranchCountList, RespCountList, RespPurchase } from 'src/app/core/models/purchases';
import { DtPage } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ReqStoreSheetUpload } from 'src/app/core/models/sheet-product';
import { BranchCountService } from 'src/app/core/services/branch-count.service';
import { BranchCountDetailsComponent } from '../branch-count-details/branch-count-details.component';
import { BranchUpdateCountComponent } from '../branch-update-count/branch-update-count.component';


@Component({
  selector: 'app-branch-count-hitory-component',
  templateUrl: './branch-count-hitory-component.component.html',
  styleUrls: ['./branch-count-hitory-component.component.css']
})
export class BranchCountHitoryComponentComponent implements OnInit {

   /* PURCHASES */
   counts: RespPurchase[];

   /* FOR TABLE */
   columnsList = [
     'id',
     'date',
     'countNumber',
     'approved'
   ]
 
   /* SELECTED STORE */
   selectedStore: number;
 
   /* PAGINATION */
   loading: boolean;
   page: DtPage;
   count: number;
 
   constructor(
     private countService: BranchCountService,
     private authService: ServiceAuth,
     private datePipe: DatePipe,
     private matDialog: MatDialog,
     private languageService: ServiceLanguage,
   ) { }
 
   ngOnInit(): void {
 
     this.selectedStore = this.authService.getBranchId();
     this.initPage();
     this.getCountList();
     this.countService.dataUpdated.subscribe(() => {
       this.getCountList();
     });
 
   }
 
   initPage() {
     this.page = {
       branchId: this.selectedStore,
       size: 10,
       page: 0
     }
   }
 
   getCountList() {
     this.loading = true;
     this.countService.geCountList(this.page).subscribe(
       (response: RespBranchCountList) => {
         console.log(response);
         this.count = response.count;
         this.counts = response.branchCountTransaction;
         this.loading = false;
       }
     );
   }
 
   stateChanged(id, event) {
     this.countService.onOpen(id, event.checked ? 1 : 0).subscribe(
       (response) => {
 
       });
   }
 
 
   /* EVENT-HANDLER */
   onRefresh() {
     this.getCountList();
   }
 
   onPageChanged($event: PageEvent) {
     this.page.page = $event.pageIndex;
     this.page.size = $event.pageSize;
     this.getCountList();
   }
 
   onFilterByDate(date: Date) {
     this.page.date = this.datePipe.transform(date, "yyyy-MM-dd");
     this.page.page = 0;
     this.getCountList();
   }
 
   cancelFilterByDate() {
     this.page.page = 0;
     this.page.date = null;
     this.getCountList();
   }
 
   onSelectCount(count: RespPurchase) {
     if (count.isApproved) {
       this.showCountDetails(count);
     } else {
       let request: ReqStoreSheetUpload = {
         branchId: this.selectedStore,
         branchProducts: [],
         countNumber: count.countNumber,
       }
       this.confirmUpload(count.id, request);
     }
   }
 
   showCountDetails(purchase: RespPurchase) {
     this.matDialog.open(BranchCountDetailsComponent, {
       width: '800px',
       data: purchase,
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       autoFocus: false,
       maxHeight: '90vh'
     });
   }
 
   confirmUpload(countId: number, request: ReqStoreSheetUpload) {
     this.matDialog.open(BranchUpdateCountComponent, {
       width: '800px',
       data: { id: countId, count: request, isApproved: false },
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       autoFocus: false,
       disableClose: true,
       maxHeight: '90vh'
     });
   }
 
   /* OTHER METHODS */
   getDate(timestamp: number) {
     return new Date(timestamp);
   }

}
