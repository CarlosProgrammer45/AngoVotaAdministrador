import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estatistica } from './estatistica';

describe('Estatistica', () => {
  let component: Estatistica;
  let fixture: ComponentFixture<Estatistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estatistica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Estatistica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
