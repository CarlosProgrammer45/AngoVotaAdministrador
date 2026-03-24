import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detalhamento1 } from './detalhamento1';

describe('Detalhamento1', () => {
  let component: Detalhamento1;
  let fixture: ComponentFixture<Detalhamento1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalhamento1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detalhamento1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
