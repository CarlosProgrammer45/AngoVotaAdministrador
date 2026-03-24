import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometriaCadastro } from './biometria-cadastro';

describe('BiometriaCadastro', () => {
  let component: BiometriaCadastro;
  let fixture: ComponentFixture<BiometriaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiometriaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiometriaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
