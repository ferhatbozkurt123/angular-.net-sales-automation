import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarilerComponent } from './cariler.component';

describe('CarilerComponent', () => {
  let component: CarilerComponent;
  let fixture: ComponentFixture<CarilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarilerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
