import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DtSelectItem } from 'src/app/core/models/select';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'stores-selector',
  templateUrl: './stores-selector.component.html',
  styleUrls: ['./stores-selector.component.css']
})
export class StoresSelectorComponent implements OnInit {

  stores: DtSelectItem[];
  inputControl: FormControl;

  // @Input('franchise') franchise: number;
  // @Input('value') value: string;
  @Output('selected') selected = new EventEmitter<DtSelectItem>();
  @Output('cleared') cleared = new EventEmitter<void>();

  constructor(private selectorsService: ServiceSelectors) { }

  ngOnInit(): void {

    this.inputControl = new FormControl();
    this.inputControl.valueChanges.subscribe(
      (value: string) => {
        if (value.length >= 2){
          this.updateList(value);
        }
      }
    );
    this.stores = [];

  }

  updateList(keyword: string){
    let franchiseId = 0;
    this.selectorsService.selectStores(keyword, franchiseId).pipe(
      tap((response: DtSelectItem[]) => {
        this.stores = response;
      })
    ).subscribe();
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    let value = event.option.value;
    let store = this.stores.find((item) => item.title == value);
    this.selected.emit(store);
  }

  clearSelection(){
    this.inputControl.setValue('');
    this.cleared.emit();
  }

}
