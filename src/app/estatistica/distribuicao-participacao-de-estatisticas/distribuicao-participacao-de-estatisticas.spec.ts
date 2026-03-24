import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribuicaoParticipacaoDeEstatisticas } from './distribuicao-participacao-de-estatisticas';

describe('DistribuicaoParticipacaoDeEstatisticas', () => {
  let component: DistribuicaoParticipacaoDeEstatisticas;
  let fixture: ComponentFixture<DistribuicaoParticipacaoDeEstatisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistribuicaoParticipacaoDeEstatisticas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistribuicaoParticipacaoDeEstatisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
