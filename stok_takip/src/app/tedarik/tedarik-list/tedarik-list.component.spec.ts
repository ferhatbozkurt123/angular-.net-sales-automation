import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TedarikListComponent } from './tedarik-list.component';

describe('TedarikListComponent', () => {
  let component: TedarikListComponent;
  let fixture: ComponentFixture<TedarikListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TedarikListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TedarikListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
