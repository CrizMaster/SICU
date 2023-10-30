import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstruccionesComponent } from './construcciones.component';

describe('ConstruccionesComponent', () => {
  let component: ConstruccionesComponent;
  let fixture: ComponentFixture<ConstruccionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstruccionesComponent]
    });
    fixture = TestBed.createComponent(ConstruccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
