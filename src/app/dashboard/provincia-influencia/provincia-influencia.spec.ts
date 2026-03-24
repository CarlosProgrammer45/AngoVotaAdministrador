import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaInfluencia } from './provincia-influencia';

describe('ProvinciaInfluencia', () => {
  let component: ProvinciaInfluencia;
  let fixture: ComponentFixture<ProvinciaInfluencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinciaInfluencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaInfluencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
