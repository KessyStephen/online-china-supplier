import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QosTwoComponent } from './qos-two.component';

describe('QosTwoComponent', () => {
  let component: QosTwoComponent;
  let fixture: ComponentFixture<QosTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QosTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QosTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
