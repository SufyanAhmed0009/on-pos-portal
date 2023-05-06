import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManageCountComponent } from './branch-manage-count.component';

describe('BranchManageCountComponent', () => {
  let component: BranchManageCountComponent;
  let fixture: ComponentFixture<BranchManageCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchManageCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchManageCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
