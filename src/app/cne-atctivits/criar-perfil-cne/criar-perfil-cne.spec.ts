import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarPerfilCne } from './criar-perfil-cne';

describe('CriarPerfilCne', () => {
  let component: CriarPerfilCne;
  let fixture: ComponentFixture<CriarPerfilCne>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarPerfilCne]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarPerfilCne);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
