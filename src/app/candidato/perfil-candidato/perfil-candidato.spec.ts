import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCandidato } from './perfil-candidato';

describe('PerfilCandidato', () => {
  let component: PerfilCandidato;
  let fixture: ComponentFixture<PerfilCandidato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilCandidato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilCandidato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
