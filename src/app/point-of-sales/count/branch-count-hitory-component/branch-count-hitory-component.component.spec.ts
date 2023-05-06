import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCountHitoryComponentComponent } from './branch-count-hitory-component.component';

describe('BranchCountHitoryComponentComponent', () => {
  let component: BranchCountHitoryComponentComponent;
  let fixture: ComponentFixture<BranchCountHitoryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCountHitoryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCountHitoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
