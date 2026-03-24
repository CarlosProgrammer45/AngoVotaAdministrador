import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhamentoProvincial } from './detalhamento-provincial';

describe('DetalhamentoProvincial', () => {
  let component: DetalhamentoProvincial;
  let fixture: ComponentFixture<DetalhamentoProvincial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhamentoProvincial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhamentoProvincial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
