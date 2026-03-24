import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detelhamento3 } from './detelhamento3';

describe('Detelhamento3', () => {
  let component: Detelhamento3;
  let fixture: ComponentFixture<Detelhamento3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detelhamento3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detelhamento3);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
