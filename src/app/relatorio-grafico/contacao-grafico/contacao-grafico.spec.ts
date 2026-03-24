import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacaoGrafico } from './contacao-grafico';

describe('ContacaoGrafico', () => {
  let component: ContacaoGrafico;
  let fixture: ComponentFixture<ContacaoGrafico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContacaoGrafico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContacaoGrafico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
