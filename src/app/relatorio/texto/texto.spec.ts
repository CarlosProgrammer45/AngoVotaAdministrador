import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Texto } from './texto';

describe('Texto', () => {
  let component: Texto;
  let fixture: ComponentFixture<Texto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Texto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Texto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
