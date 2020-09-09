import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAttributeComponent } from './custom-attribute.component';

describe('CustomAttributeComponent', () => {
  let component: CustomAttributeComponent;
  let fixture: ComponentFixture<CustomAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
