import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioGrafico } from './relatorio-grafico';

describe('RelatorioGrafico', () => {
  let component: RelatorioGrafico;
  let fixture: ComponentFixture<RelatorioGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioGrafico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
