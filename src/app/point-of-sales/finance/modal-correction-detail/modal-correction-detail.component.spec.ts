import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCorrectionDetailComponent } from './modal-correction-detail.component';

describe('ModalCorrectionDetailComponent', () => {
  let component: ModalCorrectionDetailComponent;
  let fixture: ComponentFixture<ModalCorrectionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCorrectionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCorrectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
