import { Component, OnInit } from '@angular/core';
import { RespInvoice, RespInvoicesList } from 'src/app/core/models/Invoices';
import { DtPage } from 'src/app/core/models/page';
import { PageEvent } from '@angular/material/paginator';
import { ServiceInvoice } from 'src/app/core/services/invoice.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoices-history',
  templateUrl: './invoices-history.component.html',
  styleUrls: ['./invoices-history.component.css']
})
export class InvoicesHistoryComponent implements OnInit {

  /* INVOICES */
  invoices: RespInvoice[];

  /* PAGINATION */
  page: DtPage;
  count: number;
  loading: boolean = false;

  constructor(
    private invoiceService: ServiceInvoice,
    private snackbarService: ServiceSnackbar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.initPage();
    this.getInvoicesList();

  }

  /* INIT PAGE */
  initPage() {
    this.page = {
      date : this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      size: 10,
      page: 0
    }
  }

  /* GET INVOICES LIST */
  getInvoicesList() {
    this.loading = true;
    this.invoiceService.getInvoiceList(this.page).subscribe(
      (response: RespInvoicesList) => {
        this.count = response.totalRecords;
        this.invoices = response.invoiceList;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.snackbarService.showErrorMessage("Error loading data!");
      }
    );
  }

  /* EVENT-HANDLERS */
  onSearch(keyword: string) {

  }

  onRefresh() {
    this.getInvoicesList();
  }

  onCancel() {
    
  }

  onFilterByDate(date: Date) {
    this.page.date = this.datePipe.transform(date, "yyyy-MM-dd");
    this.page.page = 0;
    this.getInvoicesList();
  }

  cancelFilterByDate() {
    this.page.page = 0;
    this.page.date = null;
    this.getInvoicesList();
  }

  onPageChanged($event: PageEvent) {
    this.page.page = $event.pageIndex;
    this.page.size = $event.pageSize;
    this.getInvoicesList();
  }

}
