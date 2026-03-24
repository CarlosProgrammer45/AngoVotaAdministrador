import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacaoGlobal } from './participacao-global';

describe('ParticipacaoGlobal', () => {
  let component: ParticipacaoGlobal;
  let fixture: ComponentFixture<ParticipacaoGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipacaoGlobal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipacaoGlobal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
