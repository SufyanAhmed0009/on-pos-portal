import { Component, OnInit, Input } from '@angular/core';
import { RespInvoice } from 'src/app/core/models/Invoices';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {

  @Input('invoices') invoices: RespInvoice[];

  columns = [
    "billNumber",
    "billDate",
    "totalItems",
    "netAmount",
    "amountPaid",
    "amountReturned"
  ];

  constructor(
    private matDialog: MatDialog,
    private languageService: ServiceLanguage
  ) { }

  ngOnInit(): void {
  }

  onSelectInvoice(invoice: RespInvoice){
    this.matDialog.open(InvoiceDetailsComponent, {
      width: '800px',
      data: invoice,
      direction: <Direction> this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      height: '90vh'
    });
  }

}
