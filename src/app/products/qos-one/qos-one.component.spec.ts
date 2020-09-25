import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QosOneComponent } from './qos-one.component';

describe('QosOneComponent', () => {
  let component: QosOneComponent;
  let fixture: ComponentFixture<QosOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QosOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QosOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
