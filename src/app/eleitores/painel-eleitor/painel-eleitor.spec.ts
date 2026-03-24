import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelEleitor } from './painel-eleitor';

describe('PainelEleitor', () => {
  let component: PainelEleitor;
  let fixture: ComponentFixture<PainelEleitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelEleitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelEleitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
