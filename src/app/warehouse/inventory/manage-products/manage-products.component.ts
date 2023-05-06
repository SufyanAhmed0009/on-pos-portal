import { Component, OnInit } from '@angular/core';
import { DtPage } from 'src/app/core/models/page';
import { RespWarehouseProduct, ReqWarehouseProductsUpdateList, ResponseInventorySummary } from 'src/app/core/models/products';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { DtLanguage } from 'src/app/core/models/language';
import { ServiceWarehouseInventory } from 'src/app/core/services/warehouse-inventory.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { UpdateQuantityComponent } from 'src/app/point-of-sales/inventory/update-quantity/update-quantity.component';
import { PageEvent } from '@angular/material/paginator';
import { UpdateWhProductComponent } from '../update-product/update-product.component';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class WhManageProductsComponent implements OnInit {

  /* PRODUCTS */
  products: RespWarehouseProduct[];

  /* PAGINATION */
  page: DtPage;
  count: number;
  loading: boolean = false;

  /* STATUS LIST */
  statusToggleList: DtFilterItem[] = [
    { title: 'All Products', value: 0 },
    { title: 'Enabled Only', value: 3 },
    { title: 'Disabled Only', value: 4 },
  ]
  selectedStatus = 0;

  /* QUANTITY LIST */
  quantityToggleList: DtFilterItem[] = [
    { title: 'No Filter', value: 0 },
    { title: 'Quantity > 0', value: 1 },
  ]
  selectedQuantity = 0;

  /* DISCOUNTED LIST */
  discountToggleList: DtFilterItem[] = [
    { title: 'No Filter', value: 0 },
    { title: 'Discounted Items', value: 1 },
  ]
  selectedDiscount = 0;

  /* SELECTED WAREHOUSE */
  selectedWarehouse: DtSelectItem;

  /* INVENTORY STATUS */
  inventoryStatus: ResponseInventorySummary;

  isDownloading = false;
  constructor(
    private authService: ServiceAuth,
    private languageService: ServiceLanguage,
    private inventoryService: ServiceWarehouseInventory,
    private snackBarService: ServiceSnackbar,
    private spreadsheetService: ServiceSpreadsheet,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.selectedWarehouse = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.initPage();
    this.getWarehouseProducts();

    this.languageService.languageChangedEmittor.subscribe(
      (language: DtLanguage) => {
        this.getWarehouseProducts();
      }
    );

    this.authService.storeChanged.subscribe(
      (warehouse: DtSelectItem) => {
        this.selectedWarehouse = warehouse;
        this.getWarehouseProducts();
      }
    );

    this.inventoryService.getStoreInventorySummary().subscribe(
      (response: ResponseInventorySummary) => {
        this.inventoryStatus = response;
      }
    );

    this.inventoryService.whProductsForLibraryItemUpdated.subscribe(
      () => {
        this.getWarehouseProducts();
      }
    );

  }

  initPage() {
    this.page = {
      size: 10,
      page: 0
    }
  }

  getWarehouseProducts() {
    this.loading = true;
    this.page.id = this.selectedWarehouse.id;
    this.inventoryService.getWarehouseProducts(this.page).subscribe(
      (data: any) => {
        this.products = data.whItems.map(
          (item) => {
            item.isSelected = false;
            return item;
          }
        );
        this.count = data.totalRecords;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackBarService.showErrorMessage("Error Loading Data!");
      }
    );

  }

  /* UPDATE PRODUCTS */
  onUpdateProducts() {
    let selectedProducts = this.products.filter((item) => item.isSelected);
    if (selectedProducts.length == 0) {
      this.snackBarService.showErrorMessage("No Product Selected!");
    } else {
      this.updateProducts(selectedProducts);
    }
  }

  updateProducts(products: RespWarehouseProduct[]) {

    this.loading = true;
    let request = this.getRequest(products);
    this.inventoryService.updateWarehouseProducts(request).subscribe(
      (response) => {
        this.loading = false;
        this.snackBarService.showSuccessMessage("Updated Succesfully!");
        this.getWarehouseProducts();
      },
      (error) => {
        this.loading = false;
        this.snackBarService.showErrorMessage("Error Updating");
      }
    );

  }

  /* EVENT-HANDLERS */
  onSearch(keyword: string) {
    this.page.title = keyword;
    this.page.page = 0;
    this.getWarehouseProducts();
  }

  onCancelSearch() {
    this.page.title = null;
    this.page.page = 0;
    this.getWarehouseProducts();
  }

  onRefresh() {
    this.getWarehouseProducts();
  }


  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getWarehouseProducts();
  }

  onStatusChanged() {
    if (this.selectedStatus == 0) {
      this.page.statusId = null;
      this.getWarehouseProducts();
    } else {
      this.page.statusId = this.selectedStatus;
      this.getWarehouseProducts();
    }
  }

  onQuantityChanged() {
    if (this.selectedQuantity == 0) {
      this.page.quantity = null;
    } else {
      this.page.quantity = 0;
    }
    this.getWarehouseProducts();
  }

  onDiscountChanged() {
    if (this.selectedDiscount == 0) {
      this.page.discount = null;
      this.getWarehouseProducts();
    } else {
      this.page.discount = this.selectedDiscount;
      this.getWarehouseProducts();
    }
  }

  onReduceQuantity(product: RespWarehouseProduct) {
    let dialogRef = this.matDialog.open(UpdateQuantityComponent, {
      width: '510px',
      data: product,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if (data) {
          this.getWarehouseProducts();
        }
      }
    );
  }

  onUpdateProduct(product: RespWarehouseProduct) {
    let dialogRef = this.matDialog.open(UpdateWhProductComponent, {
      width: '500px',
      data: product,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response) {
          this.getWarehouseProducts();
        }
      }
    );
  }

  /* OTHER METHODS */
  getRequest(products: RespWarehouseProduct[]) {
    let request: ReqWarehouseProductsUpdateList = {
      whItems: products.map(
        (item) => {
          return {
            item: {
              id: item.id,
              price: item.price,
              quantity: item.quantity,
              minQuantity: item.minQuantity,
              maxQuantity: item.maxQuantity,
              cost: item.cost,
              discountAmount: item.discountAmount,
              netSalePrice: item.price - item.discountAmount,
              barcode: item.barcode,
              metaInventory: {
                id: item.inventoryId
              },
              pricingStrategy: {
                id: item.pricingStrategyId
              },
              verified: item.verified
            },
            statusId: item.status.id,
            libraryItemId: item.id,
          }
        }
      ),
      whId: this.selectedWarehouse.id
    }
    return request;
  }


  /* ON DOWNLOAD */
  onDownload() {
    this.isDownloading = true;
    this.inventoryService.downloadWhInventory({ ...this.page }).pipe(map((res) => {
      return {
        filename: 'warehouse_inventory.xlsx',
        data: new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
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

}

class DtFilterItem {
  title: string;
  value: number;
}