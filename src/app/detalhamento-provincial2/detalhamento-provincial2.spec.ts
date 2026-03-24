import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhamentoProvincial2 } from './detalhamento-provincial2';

describe('DetalhamentoProvincial2', () => {
  let component: DetalhamentoProvincial2;
  let fixture: ComponentFixture<DetalhamentoProvincial2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhamentoProvincial2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhamentoProvincial2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
