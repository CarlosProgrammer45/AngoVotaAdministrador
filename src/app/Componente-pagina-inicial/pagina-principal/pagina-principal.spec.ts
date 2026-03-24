import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaPrincipal } from './pagina-principal';

describe('PaginaPrincipal', () => {
  let component: PaginaPrincipal;
  let fixture: ComponentFixture<PaginaPrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaPrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaPrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
