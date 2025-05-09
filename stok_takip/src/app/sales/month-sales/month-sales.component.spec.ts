import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthSalesComponent } from './month-sales.component';

describe('MonthSalesComponent', () => {
  let component: MonthSalesComponent;
  let fixture: ComponentFixture<MonthSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
