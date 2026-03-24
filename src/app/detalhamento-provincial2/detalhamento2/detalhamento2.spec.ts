import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalhamento2 } from './detalhamento2';

describe('Detalhamento2', () => {
  let component: Detalhamento2;
  let fixture: ComponentFixture<Detalhamento2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalhamento2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detalhamento2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
