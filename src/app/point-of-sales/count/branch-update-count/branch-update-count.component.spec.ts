import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchUpdateCountComponent } from './branch-update-count.component';

describe('BranchUpdateCountComponent', () => {
  let component: BranchUpdateCountComponent;
  let fixture: ComponentFixture<BranchUpdateCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchUpdateCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchUpdateCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
