import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'single-date-selector',
  templateUrl: './single-date-selector.component.html',
  styleUrls: ['./single-date-selector.component.css']
})
export class SingleDateSelectorComponent implements OnInit {
  
  inputDate: Date;
  @Output('selected') selected = new EventEmitter<Date>();
  @Output('cancel') cancel = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
    this.inputDate = new Date();
  }

  onSelect(){
    if (this.inputDate){
      this.selected.emit(this.inputDate);
    }
  }

  onCancel(){
    this.cancel.emit();
    this.inputDate = null;
  }

}
