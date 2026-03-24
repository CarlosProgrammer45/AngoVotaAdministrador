import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarPerfil } from './mostrar-perfil';

describe('MostrarPerfil', () => {
  let component: MostrarPerfil;
  let fixture: ComponentFixture<MostrarPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
