import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSelectedProductsComponent } from './branch-selected-products.component';

describe('BranchSelectedProductsComponent', () => {
  let component: BranchSelectedProductsComponent;
  let fixture: ComponentFixture<BranchSelectedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchSelectedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSelectedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
