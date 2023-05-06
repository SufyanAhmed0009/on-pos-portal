import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'search-slice',
  templateUrl: './search-slice.component.html',
  styleUrls: ['./search-slice.component.css']
})
export class SearchSliceComponent implements OnInit {

  searchForm: FormGroup;

  @Input('title') title: string;
  @Input('keyword') keyword: string;
  @Input('searchTitle') searchTitle: string;

  @Output('search') search = new EventEmitter<string>();
  @Output('cancel') cancel = new EventEmitter<void>();
  @Output('refresh') refresh = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      input: new FormControl(this.keyword)
    });

  }

  onSearch() {
    let input: string = this.searchForm.value.input;
    if (input) {
      input = this.searchForm.value.input.trim();
      if (input.length > 0) {
        this.search.emit(input);
      }
    }
  }

  onCancel() {
    this.searchForm.controls.input.setValue('');
    this.cancel.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

}
