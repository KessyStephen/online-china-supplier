import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitySaleComponent } from './quantity-sale.component';

describe('QuantitySaleComponent', () => {
  let component: QuantitySaleComponent;
  let fixture: ComponentFixture<QuantitySaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantitySaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitySaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
