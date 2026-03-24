import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contador } from './contador';

describe('Contador', () => {
  let component: Contador;
  let fixture: ComponentFixture<Contador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
