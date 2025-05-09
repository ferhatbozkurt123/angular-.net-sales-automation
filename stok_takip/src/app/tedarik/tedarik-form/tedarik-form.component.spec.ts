import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TedarikFormComponent } from './tedarik-form.component';

describe('TedarikFormComponent', () => {
  let component: TedarikFormComponent;
  let fixture: ComponentFixture<TedarikFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TedarikFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TedarikFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
