import { Component, OnInit } from '@angular/core';
import { DtPage } from 'src/app/core/models/page';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { RespStoreLibraryItem, RespStoreLibraryItemList, DtTransferProduct, ReqBranchItem, ReqTransferProducts } from 'src/app/core/models/inventory';
import { PageEvent } from '@angular/material/paginator';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { DtSelectItem } from 'src/app/core/models/select';

@Component({
  selector: 'app-transfer-products',
  templateUrl: './transfer-products.component.html',
  styleUrls: ['./transfer-products.component.css']
})
export class TransferProductsComponent implements OnInit {

  /* PRODUCTS TO TRANSFER */
  products: DtTransferProduct[];

  /* PAGINATION AND LOADERS */
  page: DtPage;
  loading: boolean;
  count: number;
  selectedStore: number;

  constructor(
    private inventoryService: ServiceInventory,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {

    this.selectedStore = this.authService.getBranchId();
    this.initPage();
    this.getProductsList();
    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => { 
        this.selectedStore = store.id;
        this.getProductsList();
      }
    );

  }

  initPage() {
    this.page = {
      page: 0,
      size: 10,
      branchId: this.selectedStore
    }
  }

  /* GET PRODUCTS LIST */

  getProductsList() {
    this.loading = true;
    this.page.branchId = this.selectedStore;
    this.inventoryService.getBranchLibraryItems(this.page).subscribe(
      (response: RespStoreLibraryItemList) => {
        this.products = response.libraryItemList.map(
          (item) => {
            return {
              id: item.id,
              title: item.title,
              statusLanguage: item.statusLanguage,
              itemId: item.itemId,
              selected: false,
              price: 10,
              strategyId: 1,
              inventoryId: 1
            }
          }
        );
        this.count = response.totalRecords;
        this.loading = false;
      }
    );
  }

  /* EVENT HANDLERS */

  onSearch(keyword: string) {
    this.page.page = 0;
    this.page.title = keyword;
    this.getProductsList();
  }

  onRefresh() {
    this.getProductsList();
  }

  onCancel() {
    this.page.page = 0;
    this.page.title = null;
    this.getProductsList();
  }

  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getProductsList();
  }

  onTransfer() {
    let selectedItems = this.products.filter((item) => item.selected);
    if (selectedItems.length == 0) {
      this.snackbarService.showErrorMessage("No products selected!");
    } else {
      let request = this.getTransferRequest(selectedItems);
      this.loading = true;
      this.inventoryService.transferProducts(request).subscribe(
        () => {
          this.snackbarService.showSuccessMessage("Successfully Transfered!");
          this.loading = false;
          this.getProductsList();
        },
        (error) => {
          this.snackbarService.showErrorMessage("Error Transfering Products!");
          this.loading = false;
        }
      );
    }
  }

  getTransferRequest(selectedItems: DtTransferProduct[]){
    let transferProducts: ReqBranchItem[] = selectedItems.map(
      (branchItem) => {
        return {
          item: {
            price: branchItem.strategyId > 2 ? branchItem.price : null,
            quantity: 0,
            cost: 0,
            barcode: null,
            netSalePrice: 0,
            metaInventory: {
              id: branchItem.inventoryId
            },
            pricingStrategy: {
              id: branchItem.strategyId
            },
          },
          statusId: 4,
          libraryItemId: branchItem.id
        }
      }
    )
    let request: ReqTransferProducts = {
      branchItems: transferProducts,
      branchId: this.selectedStore
    }
    return request;
  }


}
