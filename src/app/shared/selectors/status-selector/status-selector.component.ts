import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DtStatus } from 'src/app/core/models/status';
import { FormControl } from '@angular/forms';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.css']
})
export class StatusSelectorComponent implements OnInit {

  allStatusList: DtStatus[];
  statusList: DtStatus[];
  inputControl: FormControl;

  @Input('value') value: number;
  @Output('selected') selected = new EventEmitter<DtStatus>();
  @Output('cleared') cleared = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

    this.allStatusList = StatusConstants.STATUS_LIST;
    this.statusList = this.allStatusList;

    this.inputControl = new FormControl('');
    if (this.value){
      let status = this.allStatusList.find((status) => status.id == this.value);
      this.inputControl.setValue(status.title);
    }
    
    this.inputControl.valueChanges.subscribe(
      (value: string) => {
          this.updateList(value);
      }
    );

  }

  updateList(keyword: string){
    this.statusList = this.allStatusList.filter(
      (item) => {
        return item.title.toLowerCase().includes(keyword.toLowerCase());
      }
    )
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    let value = event.option.value;
    let status = this.statusList.find((item) => item.title == value);
    this.selected.emit(status);
  }

  clearSelection(){
    this.inputControl.setValue('');
    this.cleared.emit();
  }

}
