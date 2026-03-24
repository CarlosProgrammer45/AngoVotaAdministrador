import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eleitores } from './eleitores';

describe('Eleitores', () => {
  let component: Eleitores;
  let fixture: ComponentFixture<Eleitores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eleitores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eleitores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
