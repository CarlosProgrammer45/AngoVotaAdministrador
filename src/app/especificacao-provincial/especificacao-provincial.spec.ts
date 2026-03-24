import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecificacaoProvincial } from './especificacao-provincial';

describe('EspecificacaoProvincial', () => {
  let component: EspecificacaoProvincial;
  let fixture: ComponentFixture<EspecificacaoProvincial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecificacaoProvincial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecificacaoProvincial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
