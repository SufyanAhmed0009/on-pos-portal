import { Component, OnInit } from '@angular/core';
import { RespStoreProduct, RespStoreProductsList, ReqStoreProductsUpdateList, ReqPasswordProductUpdate, ReqPasswordProductUpdateList, ReqPasswordProductUpdateExcel } from 'src/app/core/models/products';
import { DtPage } from 'src/app/core/models/page';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { DtLanguage } from 'src/app/core/models/language';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { DtSelectItem } from 'src/app/core/models/select';
import { MatDialog } from '@angular/material/dialog';
import { UpdateQuantityComponent } from '../update-quantity/update-quantity.component';
import { Direction } from '@angular/cdk/bidi';
import { UpdateProductComponent } from '../update-product/update-product.component';
import { JsonpInterceptor } from '@angular/common/http';
import { ModalInventoryAdminProductsDownloadComponent } from '../modal-admin-products-download/modal-admin-products-download.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  uploading: boolean;
  /* PRODUCTS */
  products: RespStoreProduct[];

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

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* RIGHTS */
  userTypeList: number[] = [];
  isAllowedUpload: boolean = false;

  nonEnablerOwner: boolean = false;
 
  constructor(
    private snackbarService: ServiceSnackbar,
    private inventoryService: ServiceInventory,
    private authService: ServiceAuth,
    private languageService: ServiceLanguage,
    private snackBarService: ServiceSnackbar,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.selectedStore = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.userTypeList = this.authService.getUserTypeList();
    this.isAllowedUpload = this.userTypeList.includes(26); 
    this.nonEnablerOwner = this.authService.getUserTypeList().includes(31);  
 
    this.initPage();
    this.getStoreProducts();

    this.languageService.languageChangedEmittor.subscribe(
      (language: DtLanguage) => {
        this.getStoreProducts();
      }
    );

    this.authService.storeChanged.subscribe(
      (store: DtSelectItem) => {
        this.selectedStore = store;
        this.getStoreProducts();
      }
    );
    
    this.inventoryService.storeProductsForLibraryItemUpdated.subscribe(
      () => {
        this.getStoreProducts();
      }
    );
  }

  initPage() {
    this.page = {
      size: 10,
      page: 0,
      isHamper : this.nonEnablerOwner ? false : null
    }
  }

  getStoreProducts() {

    this.loading = true;
    this.page.id = this.selectedStore.id;
    console.log("this.page")
    console.log(this.page)
    this.inventoryService.getBranchProducts(this.page).subscribe(
      (data: RespStoreProductsList) => {
        console.log("data")
        console.log(data)
        this.products = data.branchItems.map(
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

  updateProducts(products: RespStoreProduct[]) {

    this.loading = true;
    let request = this.getRequest(products);



    this.inventoryService.updateBranchProducts(request).subscribe(
      (response) => {
        this.loading = false;
        this.snackBarService.showSuccessMessage("Updated Succesfully!");
        this.getStoreProducts();
      },
      (error) => {
        this.loading = false;
        this.snackBarService.showErrorMessage("Error Updating");
      }
    );

  }

  updateThroughExcel(products: ReqPasswordProductUpdateExcel[]) {

    this.loading = true;
    let request = this.getExcelRequest(products);
    console.log(request);
    this.inventoryService.updateBranchProductProtectedList(request).subscribe(
      (response) => {
        this.loading = false;
        this.snackBarService.showSuccessMessage("Updated Succesfully!");
        this.getStoreProducts();
      },
      (error) => {
        this.loading = false;
        this.snackBarService.showErrorMessage("Error Updating");
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

  csvToJSON(csv, callback) {
    var lines = csv.split(/\r\n|\n/);
    
    var headers = lines[0].split(",");
    var result = [];
    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    if (callback && (typeof callback === 'function')) {
      return callback(result);
    }
    this.updateThroughExcel(result);
    console.log(result)
    return result;
  }

  readCSV(file: File) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let data = reader.result;
      this.csvToJSON(data, JSON);
      this.uploading = false;
    };
    reader.onerror = () => {
      console.error('Error reading file!');

    };
  }



  /* EVENT-HANDLERS */
  onSearch(keyword: string) {
    this.page.title = keyword;
    this.page.page = 0;
    this.getStoreProducts();
  }

  onCancelSearch() {
    this.page.title = null;
    this.page.page = 0;
    this.getStoreProducts();
  }

  onRefresh() {
    this.getStoreProducts();
  }


  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getStoreProducts();
  }

  onStatusChanged() {
    if (this.selectedStatus == 0) {
      this.page.statusId = null;
      this.getStoreProducts();
    } else {
      this.page.statusId = this.selectedStatus;
      this.getStoreProducts();
    }
  }

  onQuantityChanged() {
    if (this.selectedQuantity == 0) {
      this.page.quantity = null;
    } else {
      this.page.quantity = 0;
    }
    this.getStoreProducts();
  }

  onDiscountChanged() {
    if (this.selectedDiscount == 0) {
      this.page.discount = null;
      this.getStoreProducts();
    } else {
      this.page.discount = this.selectedDiscount;
      this.getStoreProducts();
    }
  }

  onReduceQuantity(product: RespStoreProduct) {
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
          this.getStoreProducts();
        }
      }
    );
  }

  onUpdateProduct(product: RespStoreProduct) {
    let dialogRef = this.matDialog.open(UpdateProductComponent, {
      width: '400px',
      data: product,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response) {
          this.getStoreProducts();
        }
      }
    );
  }

  /* OTHER METHODS */
  getRequest(products: RespStoreProduct[]) {
    let request: ReqStoreProductsUpdateList = {
      branchItems: products.map(
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
      branchId: this.selectedStore.id
    }
    return request;
  }


  /* ON DOWNLOAD */
  onDownload() {
    this.matDialog.open(ModalInventoryAdminProductsDownloadComponent, {
      width: '300px',
      data: this.page,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  getExcelRequest(products: ReqPasswordProductUpdateExcel[]) {
    let request: ReqPasswordProductUpdateList = {
      itemDto: products.map(
        (item) => {
          return {
            itemId: item.itemId,
            price: item.price,
            cost: item.cost,
            quantity: 0,
            netSalePrice: item.netSalePrice,
            discountAmount: item.discountAmount,
            storeDiscount: item.storeDiscount,
            onDiscount: item.onDiscount,
            quantityPerOrder: item.quantityPerOrder,
            quantityPerItem: item.quantityPerItem,
            comments: item.comments,
            statusId: 3,
            quantityAmendReasonId:null,
            strategyId:1,
            setPrice:true
          }
        }
      ),

    }
    console.log(request)
    return request;
  }
}

class DtFilterItem {
  title: string;
  value: number;
}