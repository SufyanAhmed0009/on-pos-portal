import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DtPage } from 'src/app/core/models/page';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceInventory } from 'src/app/core/services/inventory.service';
import { ServiceSpreadsheet } from 'src/app/core/services/spreadsheet.service';
import { ModelStoreProductList } from 'src/app/core/models/products';

@Component({
  selector: 'app-modal-admin-products-download',
  templateUrl: './modal-admin-products-download.component.html',
  styleUrls: ['./modal-admin-products-download.component.css']
})
export class ModalInventoryAdminProductsDownloadComponent implements OnInit {

  isDownloadable: boolean;
  currentProgress: number;
  showProgressBar: boolean = false;
  sheetData: any[];
  filter: DtPage;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DtPage,
    private dialogRef: MatDialogRef<ModalInventoryAdminProductsDownloadComponent>,
    private languageService: ServiceLanguage,
    private inventoryService: ServiceInventory,
    private spreadsheetService: ServiceSpreadsheet
  ) { }

  ngOnInit() {
    this.filter = {
      size: 100000, 
      page: 0,
      languageId: this.languageService.getCurrentLanguage().id,
      id: this.data.id,
      quantity: this.data.quantity,
      discount: this.data.discount
    }

    this.currentProgress = 0;
    this.showProgressBar = true;

    setTimeout(
      () => {
        if (this.currentProgress == 0) {
          this.currentProgress = 20;
        }
      }, 250
    );

    this.inventoryService.getSelectedBranchProducts(this.filter).subscribe(
      (data: ModelStoreProductList) => {
        console.log(data);
        this.sheetData = data.branchItems.map(
          (item) => {
            return {
              "ID": item.id,
              "Library_Item_ID": item.libItemId,
              "Title": item.title,
              "Details": item.details,
              "Price": item.price,
              "Cost": item.cost,
              "Quantity": item.quantity,
              "Discount": item.discountAmount,
              "Net_Sale_Price": item.netSalePrice,
              "Barcode": item.barcode,
              "Status": item.status.id
            };
          }
        );
        this.isDownloadable = true;
        this.currentProgress = 100;
      }
    );
  }

  onSave() {
    this.spreadsheetService.exportAsExcelFile(this.sheetData, 'store_products');
    this.dialogRef.close();
  }

}
