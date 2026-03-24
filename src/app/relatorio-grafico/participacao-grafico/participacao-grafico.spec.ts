import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacaoGrafico } from './participacao-grafico';

describe('ParticipacaoGrafico', () => {
  let component: ParticipacaoGrafico;
  let fixture: ComponentFixture<ParticipacaoGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipacaoGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipacaoGrafico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
