import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RespOrder } from 'src/app/core/models/orders';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  @Input('orders') orders: RespOrder[];
  @Output('selected') selected = new EventEmitter<RespOrder>();

  columnsList = [
    'orderNumber',
    'customer',
    'franchise',
    'totalAmount',
    'date',
    'expected',
    'delivered',
    'tat',
    'status',
  ];

  constructor(
  ) { }

  ngOnInit(): void {
    console.info(this.orders);
  }

  onSelectOrder(order: RespOrder){
    this.selected.emit(order);
  }

  getDate(timestamp: number) {
    return new Date(timestamp);
  }

  getHoursMinutes(time: number) {
    let minutes = time % 60;
    let hours = (time - minutes) / 60;
    return hours + 'h ' + minutes + 'm';
  }

}
