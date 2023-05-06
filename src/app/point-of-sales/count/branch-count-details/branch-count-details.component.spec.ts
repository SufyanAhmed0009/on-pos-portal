import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCountDetailsComponent } from './branch-count-details.component';

describe('BranchCountDetailsComponent', () => {
  let component: BranchCountDetailsComponent;
  let fixture: ComponentFixture<BranchCountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
