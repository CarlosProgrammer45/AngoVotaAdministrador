import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorEstatistica } from './contador-estatistica';

describe('ContadorEstatistica', () => {
  let component: ContadorEstatistica;
  let fixture: ComponentFixture<ContadorEstatistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContadorEstatistica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContadorEstatistica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
