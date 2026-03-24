import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoDeEstatisticas } from './fluxo-de-estatisticas';

describe('FluxoDeEstatisticas', () => {
  let component: FluxoDeEstatisticas;
  let fixture: ComponentFixture<FluxoDeEstatisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluxoDeEstatisticas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxoDeEstatisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
