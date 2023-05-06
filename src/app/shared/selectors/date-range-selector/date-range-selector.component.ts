import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DtDateRange } from 'src/app/core/models/date';

@Component({
  selector: 'date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent implements OnInit {

  startDate: Date;
  endDate: Date;

  @Output('filter') filter = new EventEmitter<DtDateRange>();
  @Output('cancel') cancel = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onFilter() {
    if (this.startDate && this.endDate){
      this.filter.emit({
        start: this.startDate,
        end: this.endDate
      });
    }
  }

  onCancelFilter() {
    this.startDate = null;
    this.endDate = null;
    this.cancel.emit();
  }

}
