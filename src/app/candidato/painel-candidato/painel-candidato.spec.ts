import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelCandidato } from './painel-candidato';

describe('PainelCandidato', () => {
  let component: PainelCandidato;
  let fixture: ComponentFixture<PainelCandidato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelCandidato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelCandidato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
