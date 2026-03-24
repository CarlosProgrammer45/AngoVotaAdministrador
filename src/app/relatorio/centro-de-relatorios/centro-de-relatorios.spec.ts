import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroDeRelatorios } from './centro-de-relatorios';

describe('CentroDeRelatorios', () => {
  let component: CentroDeRelatorios;
  let fixture: ComponentFixture<CentroDeRelatorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroDeRelatorios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroDeRelatorios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
