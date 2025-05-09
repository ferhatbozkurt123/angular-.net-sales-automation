import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSalesComponent } from './year-sales.component';

describe('YearSalesComponent', () => {
  let component: YearSalesComponent;
  let fixture: ComponentFixture<YearSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
