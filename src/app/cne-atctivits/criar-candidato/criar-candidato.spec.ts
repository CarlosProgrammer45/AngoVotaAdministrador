import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCandidato } from './criar-candidato';

describe('CriarCandidato', () => {
  let component: CriarCandidato;
  let fixture: ComponentFixture<CriarCandidato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarCandidato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarCandidato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
