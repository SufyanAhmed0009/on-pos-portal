import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDOSComponent } from './modal-dos.component';

describe('ModalDOSComponent', () => {
  let component: ModalDOSComponent;
  let fixture: ComponentFixture<ModalDOSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDOSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
