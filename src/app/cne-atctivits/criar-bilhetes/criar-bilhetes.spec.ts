import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarBilhetes } from './criar-bilhetes';

describe('CriarBilhetes', () => {
  let component: CriarBilhetes;
  let fixture: ComponentFixture<CriarBilhetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarBilhetes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarBilhetes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
