import { Component, OnInit } from '@angular/core';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceSales } from 'src/app/core/services/sales.service';
import { RespDailySales } from 'src/app/core/models/sales';
import { DtSelectItem } from 'src/app/core/models/select';

@Component({
  selector: 'app-orders-sales',
  templateUrl: './orders-sales.component.html',
  styleUrls: ['./orders-sales.component.css']
})
export class OrdersSalesComponent implements OnInit {

  branchId: number;
  loadingDailySales: boolean;
  loadingInventory: boolean;
  loadingPendingSale: boolean;

  inventory = {
    worth: 0,
    quantity: 0
  }

  dailySalesList: RespDailySales[];
  salesTotal: RespDailySales;

  pendingSales: RespDailySales;

  nonEnablerOwner: boolean = false;
  col: string = 'col-8';

  constructor(
    private authService: ServiceAuth,
    private salesService: ServiceSales
  ) { }

  ngOnInit(): void {

    this.branchId = this.authService.getBranchId();
    this.nonEnablerOwner = this.authService.getUserTypeList().includes(31);
    
    if(this.nonEnablerOwner){
      this.col = 'col-12';
    }

    this.getDailySalesList();
    this.getPendingOrdersSales();
    this.getAvailableInventory();

    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.branchId = store.id;
        this.getDailySalesList();
        this.getAvailableInventory();
        this.getPendingOrdersSales();
      }
    );

  }

  getPendingOrdersSales(){
    this.loadingPendingSale = true;
    return this.salesService.getPendingOrdersSales(this.branchId).subscribe(
      (response: RespDailySales) => {
        this.pendingSales = response;
        this.loadingPendingSale = false;
      }
    );
  }

  getDailySalesList() {
    this.loadingDailySales = true;
    this.salesService.getDailySalesList(this.branchId).subscribe(
      (response: RespDailySales[]) => {
        this.dailySalesList = response;
        this.setSalesTotal();
        this.loadingDailySales = false;
      }
    )
  }

  getAvailableInventory() {
    this.loadingInventory = true;
    this.salesService.getAvailableInventory(this.branchId).subscribe(
      (response: { availableInHand: number, availableInHandCount: number }) => {
        this.inventory.worth = response.availableInHand;
        this.inventory.quantity = response.availableInHandCount;
        this.loadingInventory = false;
      }
    );
  }

  setSalesTotal(){
    this.salesTotal = {
      sale: 0,
      cogs: 0,
      date: null,
      profit: 0,
      orderCount: 0
    }
    this.dailySalesList.forEach(
      (saleItem) => {
        this.salesTotal.sale += saleItem.sale ? Math.round(saleItem.sale) : 0;
        this.salesTotal.cogs += saleItem.cogs ? Math.round(saleItem.cogs) : 0;
        this.salesTotal.profit += saleItem.profit;
        this.salesTotal.orderCount += saleItem.orderCount;
      }
    );
  }

}
