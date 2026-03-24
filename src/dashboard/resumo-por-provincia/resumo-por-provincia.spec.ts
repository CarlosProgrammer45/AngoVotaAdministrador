import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoPorProvincia } from './resumo-por-provincia';

describe('ResumoPorProvincia', () => {
  let component: ResumoPorProvincia;
  let fixture: ComponentFixture<ResumoPorProvincia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoPorProvincia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumoPorProvincia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
