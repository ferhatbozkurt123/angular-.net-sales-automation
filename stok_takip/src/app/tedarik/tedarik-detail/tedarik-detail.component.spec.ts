import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TedarikDetailComponent } from './tedarik-detail.component';

describe('TedarikDetailComponent', () => {
  let component: TedarikDetailComponent;
  let fixture: ComponentFixture<TedarikDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TedarikDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TedarikDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
