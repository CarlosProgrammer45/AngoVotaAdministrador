import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidacaoNacional } from './consolidacao-nacional';

describe('ConsolidacaoNacional', () => {
  let component: ConsolidacaoNacional;
  let fixture: ComponentFixture<ConsolidacaoNacional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidacaoNacional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidacaoNacional);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
