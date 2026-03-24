import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Localizacao } from './localizacao';

describe('Localizacao', () => {
  let component: Localizacao;
  let fixture: ComponentFixture<Localizacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Localizacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Localizacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
