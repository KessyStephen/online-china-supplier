import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QosComponent } from './qos.component';

describe('QosComponent', () => {
  let component: QosComponent;
  let fixture: ComponentFixture<QosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
