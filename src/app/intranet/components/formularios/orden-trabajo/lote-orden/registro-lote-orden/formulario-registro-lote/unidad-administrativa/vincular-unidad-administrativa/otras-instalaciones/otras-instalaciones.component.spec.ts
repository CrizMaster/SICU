import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrasInstalacionesComponent } from './otras-instalaciones.component';

describe('OtrasInstalacionesComponent', () => {
  let component: OtrasInstalacionesComponent;
  let fixture: ComponentFixture<OtrasInstalacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtrasInstalacionesComponent]
    });
    fixture = TestBed.createComponent(OtrasInstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
